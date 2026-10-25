'use client'

import { useEffect } from 'react'

// The only JS of the menus (docs/14 ADR-020, ADR-024): the Popover API already handles Esc,
// light dismiss and focus return, but not these two cases, for the mobile menu and for each
// dropdown of the bar:
// - a tap on one of its links: a same-page jump (#precios) would leave the panel open, and
//   the Cal.com popup would open under it (the popover sits in the top layer);
// - Tab past its last link: focus would land on the page hidden under the panel (WCAG 2.4.11).
// `menuIds` are the ids of the [popover] elements; each toggle button carries aria-controls.
export function MenuCloser({ menuIds }: { menuIds: string[] }) {
  const ids = menuIds.join(' ') // a stable dependency: the array is new on every render
  useEffect(() => {
    const cleanups = ids.split(' ').map((menuId) => {
      const menu = document.getElementById(menuId)
      if (!menu?.hidePopover) return () => {} // no Popover API: nav.css hides the menus
      const close = () => menu.matches(':popover-open') && menu.hidePopover()
      const onClick = (e: MouseEvent) => {
        if ((e.target as Element).closest('a')) close()
      }
      // Focus moving to the page; back to the toggle button (Shift+Tab) keeps the panel open
      const onFocusOut = (e: FocusEvent) => {
        const to = e.relatedTarget as Element | null
        if (to && !menu.contains(to) && to.getAttribute('aria-controls') !== menuId) close()
      }
      menu.addEventListener('click', onClick)
      menu.addEventListener('focusout', onFocusOut)
      return () => {
        menu.removeEventListener('click', onClick)
        menu.removeEventListener('focusout', onFocusOut)
      }
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [ids])
  return null
}
