// `pnpm media:icons`: draws the raster icons from src/app/icon.svg, the "AH" monogram that
// Next serves as the SVG favicon. favicon.ico (16, 32 and 48 px PNGs inside one ICO) is for
// browsers without SVG favicons and for Google's results, which ask for a multiple of 48 px;
// apple-icon.png (180 px) is the iOS home-screen icon, full bleed because iOS rounds the corners
// itself. Next picks up all three from src/app/. Local only; re-run it when icon.svg changes.

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const APP = path.resolve(import.meta.dirname, '../src/app')
const INK = '#15192b' // --ink-1, the icon's background

const svg = await readFile(path.join(APP, 'icon.svg'))

/** The SVG at `size` px, rasterized at 4× first for clean edges. */
function png(size, background) {
  const image = sharp(svg, { density: 72 * (size / 32) * 4 }).resize(size, size)
  return (background ? image.flatten({ background }) : image).png().toBuffer()
}

/** An ICO file whose entries are PNGs (supported since Windows Vista). */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i
    header.writeUInt8(size % 256, entry) // 0 means 256
    header.writeUInt8(size % 256, entry + 1)
    header.writeUInt16LE(1, entry + 4) // color planes
    header.writeUInt16LE(32, entry + 6) // bits per pixel
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((image) => image.data)])
}

const sizes = [16, 32, 48]
const entries = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })))
await writeFile(path.join(APP, 'favicon.ico'), ico(entries))
// Flattened on ink, so the rounded corners of the SVG become a full square
await writeFile(path.join(APP, 'apple-icon.png'), await png(180, INK))
console.log('favicon.ico (16, 32, 48) and apple-icon.png (180) written to src/app/')
