// Minimal Chrome DevTools Protocol client for the local media scripts (docs/06 §4, R-04).
// No Puppeteer or Playwright: Node 24 ships WebSocket and fetch, and these scripts only need to
// open a page, emulate a device, wait for it to settle and take a screenshot. Local only; they
// never run in Workers Builds.

import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const DEFAULT_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'

/**
 * Launches headless Chrome with a throwaway profile and connects to it.
 * CHROME_PATH overrides the binary; CDP_PROFILE_ROOT (or `profileRoot`) sets where the temp
 * profile lives, so runs never touch the user's own Chrome profile.
 */
export async function launchChrome({
  chromePath = process.env.CHROME_PATH || DEFAULT_CHROME,
  profileRoot = process.env.CDP_PROFILE_ROOT || tmpdir(),
  headless = true,
} = {}) {
  const userDataDir = await mkdtemp(path.join(profileRoot, 'cdp-profile-'))
  const args = [
    ...(headless ? ['--headless=new'] : []),
    '--remote-debugging-port=0', // Chrome picks a free port and writes it to DevToolsActivePort
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-sync',
    '--hide-scrollbars',
    '--mute-audio',
    '--force-color-profile=srgb', // screenshots keep the site's real colors
    '--font-render-hinting=none',
    'about:blank',
  ]
  const proc = spawn(chromePath, args, { stdio: ['ignore', 'ignore', 'pipe'] })
  let stderr = ''
  proc.stderr.on('data', (chunk) => (stderr = (stderr + chunk).slice(-4000)))

  const activePort = path.join(userDataDir, 'DevToolsActivePort')
  let port
  for (let i = 0; i < 100 && !port; i++) {
    try {
      const [line] = (await readFile(activePort, 'utf8')).split('\n')
      port = Number(line) || undefined
    } catch {
      await sleep(100)
    }
  }
  if (!port) {
    proc.kill('SIGKILL')
    throw new Error(`Chrome did not open a DevTools port.\n${stderr}`)
  }
  const { webSocketDebuggerUrl } = await (
    await fetch(`http://127.0.0.1:${port}/json/version`)
  ).json()
  const conn = await Connection.open(webSocketDebuggerUrl)
  return new Browser(conn, proc, userDataDir)
}

/** One WebSocket to the browser target; pages are flattened sessions on it. */
class Connection {
  #ws
  #id = 0
  #pending = new Map()
  #listeners = new Set()

  static open(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url)
      ws.addEventListener('open', () => resolve(new Connection(ws)), { once: true })
      ws.addEventListener('error', (e) => reject(e.error ?? new Error('CDP socket error')), {
        once: true,
      })
    })
  }

  constructor(ws) {
    this.#ws = ws
    ws.addEventListener('message', ({ data }) => {
      const msg = JSON.parse(data)
      if (msg.id !== undefined) {
        const pending = this.#pending.get(msg.id)
        if (!pending) return
        this.#pending.delete(msg.id)
        if (msg.error) pending.reject(new Error(`${pending.method}: ${msg.error.message}`))
        else pending.resolve(msg.result)
      } else {
        for (const listener of this.#listeners) listener(msg)
      }
    })
  }

  /** Sends one command; rejects after `timeout` ms so a stuck page never hangs the script. */
  send(method, params = {}, sessionId, timeout = 60_000) {
    const id = ++this.#id
    this.#ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id)
        reject(new Error(`${method}: no response in ${timeout} ms`))
      }, timeout)
      this.#pending.set(id, {
        method,
        resolve: (v) => (clearTimeout(timer), resolve(v)),
        reject: (e) => (clearTimeout(timer), reject(e)),
      })
    })
  }

  /** Subscribes to events; returns the unsubscribe function. */
  on(listener) {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  close() {
    this.#ws.close()
  }
}

class Browser {
  constructor(conn, proc, userDataDir) {
    this.conn = conn
    this.proc = proc
    this.userDataDir = userDataDir
  }

  async newPage() {
    const { targetId } = await this.conn.send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await this.conn.send('Target.attachToTarget', { targetId, flatten: true })
    const page = new Page(this.conn, sessionId, targetId)
    await Promise.all([
      page.send('Page.enable'),
      page.send('Runtime.enable'),
      page.send('Network.enable'),
    ])
    return page
  }

  /** Closes Chrome, waits for it to exit (it writes to the profile until then), drops the profile. */
  async close() {
    const exited =
      this.proc.exitCode === null
        ? new Promise((resolve) => this.proc.once('exit', resolve))
        : Promise.resolve()
    try {
      await this.conn.send('Browser.close', {}, undefined, 5_000)
    } catch {
      // already gone
    }
    this.conn.close()
    await Promise.race([exited, sleep(5_000)])
    if (this.proc.exitCode === null) this.proc.kill('SIGKILL')
    await rm(this.userDataDir, { recursive: true, force: true, maxRetries: 3 }).catch(() => {})
  }
}

class Page {
  #inflight = new Map()
  #lastNetworkChange = Date.now()

  constructor(conn, sessionId, targetId) {
    this.conn = conn
    this.sessionId = sessionId
    this.targetId = targetId
    // In-flight request count for the network-idle wait. WebSockets and event streams never
    // finish, so they are not counted.
    conn.on((msg) => {
      if (msg.sessionId !== sessionId) return
      const p = msg.params
      if (msg.method === 'Network.requestWillBeSent' && p.type !== 'EventSource') {
        this.#inflight.set(p.requestId, Date.now())
        this.#lastNetworkChange = Date.now()
      } else if (
        msg.method === 'Network.loadingFinished' ||
        msg.method === 'Network.loadingFailed' ||
        msg.method === 'Network.webSocketCreated'
      ) {
        this.#inflight.delete(p.requestId)
        this.#lastNetworkChange = Date.now()
      }
    })
  }

  send(method, params) {
    return this.conn.send(method, params, this.sessionId)
  }

  /** Resolves with the params of the next matching event on this page. */
  waitForEvent(method, timeout = 30_000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off()
        reject(new Error(`Timed out waiting for ${method}`))
      }, timeout)
      const off = this.conn.on((msg) => {
        if (msg.sessionId === this.sessionId && msg.method === method) {
          clearTimeout(timer)
          off()
          resolve(msg.params)
        }
      })
    })
  }

  /**
   * Device emulation: CSS viewport, device pixel ratio, mobile layout and touch, and an
   * optional user agent (the iPhone one for phone captures).
   */
  async setViewport({ width, height, deviceScaleFactor = 1, mobile = false, userAgent }) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile,
      screenWidth: width,
      screenHeight: height,
    })
    await this.send('Emulation.setTouchEmulationEnabled', {
      enabled: mobile,
      ...(mobile ? { maxTouchPoints: 5 } : {}),
    })
    if (userAgent) {
      await this.send('Emulation.setUserAgentOverride', {
        userAgent,
        ...(mobile ? { platform: 'iPhone' } : {}),
      })
    }
    this.viewport = { width, height, deviceScaleFactor, mobile }
  }

  /** Runs a script in every new document before the page's own scripts (e.g. storage seeds). */
  addInitScript(source) {
    return this.send('Page.addScriptToEvaluateOnNewDocument', { source })
  }

  /**
   * Navigates and waits for: the load event, no network activity for `idleMs`, webfonts
   * (document.fonts.ready) and every <img> in the document decoded.
   */
  async goto(url, { timeout = 45_000, idleMs = 800 } = {}) {
    const loaded = this.waitForEvent('Page.loadEventFired', timeout)
    const { errorText } = await this.send('Page.navigate', { url })
    if (errorText) throw new Error(`Navigation to ${url} failed: ${errorText}`)
    await loaded
    // Pages that stream media can stay busy; idle is best effort past the timeout
    await this.waitForNetworkIdle({ idleMs, timeout: 20_000 }).catch((e) =>
      console.warn(`  ${e.message} (${url}), continuing`),
    )
    await this.settle()
  }

  async waitForNetworkIdle({ idleMs = 800, timeout = 30_000 } = {}) {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      // A request stuck for > 10 s (analytics beacons, long polls) doesn't block idleness
      for (const [id, t] of this.#inflight) if (Date.now() - t > 10_000) this.#inflight.delete(id)
      if (this.#inflight.size === 0 && Date.now() - this.#lastNetworkChange >= idleMs) return
      await sleep(100)
    }
    throw new Error(`Network did not go idle within ${timeout} ms`)
  }

  /**
   * Waits for fonts and for the images that intersect the viewport (lazy ones further down
   * never load until scrolled to, see scrollThrough), at most `timeout` ms, then two animation
   * frames so layout and paint are final.
   */
  settle({ timeout = 10_000 } = {}) {
    return this.evaluate(async (ms) => {
      const inView = (el) => {
        const r = el.getBoundingClientRect()
        return r.bottom > 0 && r.top < innerHeight && r.width > 0
      }
      const images = Promise.all(
        [...document.images].filter(inView).map((img) =>
          img.complete
            ? img.decode?.().catch(() => {})
            : new Promise((r) => {
                img.addEventListener('load', r, { once: true })
                img.addEventListener('error', r, { once: true })
              }),
        ),
      )
      await Promise.race([
        Promise.all([document.fonts.ready, images]),
        new Promise((r) => setTimeout(r, ms)),
      ])
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    }, timeout)
  }

  /**
   * Scrolls down the document one viewport at a time so lazy images and in-view effects load,
   * up to `maxHeight` CSS px, then returns to the top and waits for the network again.
   */
  async scrollThrough({ maxHeight = Infinity, stepDelay = 250 } = {}) {
    const height = await this.evaluate(() => document.documentElement.scrollHeight)
    const step = this.viewport?.height ?? 800
    for (let y = 0; y < Math.min(height, maxHeight); y += step) {
      await this.scrollTo(y)
      await sleep(stepDelay)
    }
    await this.scrollTo(0)
    await this.waitForNetworkIdle({ idleMs: 500 }).catch(() => {})
    await this.settle()
  }

  /**
   * Evaluates a function (serialized with its JSON-serializable args) or an expression string
   * in the page and returns the result by value.
   */
  async evaluate(fnOrExpression, ...args) {
    const expression =
      typeof fnOrExpression === 'function'
        ? `(${fnOrExpression.toString()})(...${JSON.stringify(args)})`
        : fnOrExpression
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    })
    if (exceptionDetails) {
      const detail = exceptionDetails.exception?.description ?? exceptionDetails.text
      throw new Error(`Evaluation failed: ${detail}`)
    }
    return result.value
  }

  /** Adds a <style> to the current document (hide banners and widgets, stop animations). */
  injectCSS(css) {
    return this.evaluate((text) => {
      const style = document.createElement('style')
      style.dataset.capture = ''
      style.textContent = text
      document.head.append(style)
    }, css)
  }

  async waitFor(selector, { timeout = 15_000, visible = true } = {}) {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      const found = await this.evaluate(
        (sel, mustBeVisible) => {
          const el = document.querySelector(sel)
          if (!el) return false
          if (!mustBeVisible) return true
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
        },
        selector,
        visible,
      )
      if (found) return
      await sleep(100)
    }
    throw new Error(`Timed out waiting for ${selector}`)
  }

  /** Center of the element in CSS px relative to the viewport, after scrolling it into view. */
  async #center(selector) {
    const box = await this.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      el.scrollIntoView({ block: 'center', inline: 'center' })
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }, selector)
    if (!box) throw new Error(`No element matches ${selector}`)
    return box
  }

  /** A real pointer click (mouse or tap, following the emulated device). */
  async click(selector) {
    const { x, y } = await this.#center(selector)
    if (this.viewport?.mobile) {
      const touchPoints = [{ x, y }]
      await this.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints })
      await this.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      return
    }
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
      await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 })
    }
  }

  /** Focuses the field, selects what it holds and types `text` as real input events. */
  async type(selector, text) {
    await this.#center(selector)
    await this.evaluate((sel) => {
      const el = document.querySelector(sel)
      el.focus()
      el.select?.()
    }, selector)
    await this.send('Input.insertText', { text })
  }

  /**
   * Sets a native <select> (or any input) value the way React notices: through the prototype
   * setter, then input and change events.
   */
  setValue(selector, value) {
    return this.evaluate(
      (sel, val) => {
        const el = document.querySelector(sel)
        if (!el) throw new Error(`No element matches ${sel}`)
        const proto = Object.getPrototypeOf(el)
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val)
        el.dispatchEvent(new Event('input', { bubbles: true }))
        el.dispatchEvent(new Event('change', { bubbles: true }))
      },
      selector,
      value,
    )
  }

  scrollTo(y) {
    return this.evaluate((top) => {
      window.scrollTo({ top, behavior: 'instant' })
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    }, y)
  }

  /**
   * PNG screenshot. Default: the current viewport. `fullPage` captures from the top of the
   * document down to `maxHeight` CSS px; `clip` ({x, y, width, height} in CSS px, document
   * coordinates) captures a region. Output pixels = CSS px × deviceScaleFactor.
   */
  async screenshot({ fullPage = false, maxHeight = Infinity, clip } = {}) {
    let region = clip
    if (fullPage) {
      const { cssContentSize } = await this.send('Page.getLayoutMetrics')
      region = {
        x: 0,
        y: 0,
        width: this.viewport?.width ?? Math.ceil(cssContentSize.width),
        height: Math.min(Math.ceil(cssContentSize.height), maxHeight),
      }
    }
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      ...(region ? { clip: { ...region, scale: 1 }, captureBeyondViewport: true } : {}),
    })
    return Buffer.from(data, 'base64')
  }

  close() {
    return this.conn.send('Target.closeTarget', { targetId: this.targetId })
  }
}
