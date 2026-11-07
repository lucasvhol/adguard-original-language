/* OPTIONAL and experimental. Best effort: click clearly labeled 'Show original'
   controls on X and LinkedIn. Enable separately, after testing in your locale. */
(() => {
  'use strict';
  if (window.__agSocialOriginalsInstalled) return;
  const onX = ['x.com', 'twitter.com'].includes(location.hostname);
  const onLinkedIn = location.hostname === 'www.linkedin.com';
  if (!onX && !onLinkedIn) return;
  window.__agSocialOriginalsInstalled = true;

  const exact = new Set([
    'show original', 'see original', 'view original', 'ver original',
    'mostrar original', 'mostrar o original', 'voir l’original', "voir l'original",
    'original anzeigen', 'mostra originale', 'показать оригинал',
    '原文を表示', '显示原文', '顯示原文', '원문 보기', 'orijinali göster',
  ]);
  const clicked = new WeakSet();
  const run = () => {
    const scopes = onX
      ? document.querySelectorAll('article[data-testid="tweet"]')
      : document.querySelectorAll('.feed-shared-update-v2, .occludable-update, main');
    let checked = 0;
    for (const scope of scopes) {
      for (const el of scope.querySelectorAll('button,[role="button"],a')) {
        if (++checked > 700) return;
        if (clicked.has(el)) continue;
        const text = (el.textContent || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
        const label = (el.getAttribute('aria-label') || '').trim().toLocaleLowerCase();
        if (!exact.has(text) && !exact.has(label)) continue;
        // Do not follow links to external destinations.
        if (el.tagName === 'A' && el.href && !el.href.startsWith(location.origin + '/')) continue;
        clicked.add(el);
        el.click();
      }
    }
  };
  let timer;
  const schedule = () => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; run(); }, 180);
  };
  if (document.documentElement) new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
  schedule();
})();
