/* Opt-in diagnostics, included into each module by build.py. Silent unless the
   user runs localStorage.setItem('agOriginalLanguageDebug', '1') on the site. */
const agDebug = (() => {
  let enabled = false;
  try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) { /* Storage can be blocked. */ }
  return (...args) => { if (enabled) console.debug('[Original Language __VERSION__]', ...args); };
})();
