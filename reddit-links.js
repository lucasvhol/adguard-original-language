/* Reddit: remove the machine-translation "tl" parameter from in-site navigation.
   The $removeparam rule only sees network requests, so links followed inside the
   single-page app, and every page in the userscript build, are handled here. */
(() => {
  'use strict';
  if (window.__agOriginalRedditInstalled) return;
  window.__agOriginalRedditInstalled = true;
  /* @include lib/debug.js */

  const clean = href => {
    try {
      const url = new URL(href, location.href);
      if (!url.searchParams.has('tl')) return null;
      url.searchParams.delete('tl');
      return url.href;
    } catch (_) { return null; }
  };

  // Already rendered in translation, so this needs a real navigation.
  const current = clean(location.href);
  if (current) { agDebug('reddit: reloading without tl'); location.replace(current); return; }

  // Capture phase: runs before Reddit's own router reads the link.
  const fixLink = event => {
    const link = event.target?.closest?.('a[href*="tl="]');
    if (!link) return;
    const cleaned = clean(link.href);
    if (cleaned) link.href = cleaned;
  };
  document.addEventListener('click', fixLink, true);
  document.addEventListener('auxclick', fixLink, true);

  for (const method of ['pushState', 'replaceState']) {
    const native = history[method];
    history[method] = function (state, title, url) {
      const cleaned = url === undefined || url === null ? null : clean(String(url));
      return native.call(this, state, title, cleaned || url);
    };
  }
})();
