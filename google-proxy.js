/* Bypass Google Translate's full-page proxy when u= is a safe web URL.
   This rule intentionally does not modify the Google Translate text editor. */
(() => {
  'use strict';
  if (location.hostname !== 'translate.google.com') return;
  if (!['/translate', '/website'].includes(location.pathname)) return;
  try {
    const candidate = new URL(location.href).searchParams.get('u');
    if (!candidate) return;
    const original = new URL(candidate);
    if (!['http:', 'https:'].includes(original.protocol) || !original.hostname || original.username || original.password) return;
    if (original.hostname === 'translate.google.com' || original.href === location.href) return;
    location.replace(original.href);
  } catch (_) { /* Leave unsupported or malformed navigation alone. */ }
})();
