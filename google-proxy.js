/* Bypass Google's full-page translation proxies when they point at a safe web URL.
   This rule intentionally does not modify the Google Translate text editor.
   Add #keep-translation to a translated URL to stay on the translated page. The
   choice is remembered for the tab so links inside that translated site keep working. */
(() => {
  'use strict';
  /* @include lib/debug.js */
  /* @include lib/translated-url.js */
  const keepKey = 'agKeepTranslation';
  const keepsTranslation = () => {
    const marked = new URL(location.href).hash.includes('keep-translation');
    try {
      if (marked) sessionStorage.setItem(keepKey, '1');
      return marked || sessionStorage.getItem(keepKey) === '1';
    } catch (_) { return marked; }
  };
  if (keepsTranslation()) { agDebug('google-proxy: translation kept'); return; }
  const original = getOriginalUrl(location.href);
  if (!original || original === location.href) return;
  agDebug('google-proxy: leaving translated page', original);
  location.replace(original);
})();
