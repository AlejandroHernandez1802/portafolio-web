// Market detection (docs/04 §8). Runs inline in <head> before first paint, in this order:
// 1. ?mkt=co|us in the URL (saved to localStorage), 2. previous choice in localStorage,
// 3. device time zone America/Bogota → co, 4. us. Without JavaScript the CSS shows USD.
export const MARKET_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('mkt');if(q==='co'||q==='us')localStorage.setItem('mkt',q);var m=localStorage.getItem('mkt')||(Intl.DateTimeFormat().resolvedOptions().timeZone==='America/Bogota'?'co':'us');document.documentElement.setAttribute('data-market',m)}catch(e){}})()`
