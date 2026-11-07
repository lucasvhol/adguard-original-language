/* OPTIONAL and experimental. Best effort: click clearly labeled 'Show original'
   controls on social sites. Enable separately, after testing in your locale. */
(() => {
  'use strict';
  if (window.__agSocialOriginalsInstalled) return;
  const onHost = (...domains) => domains.some(domain => location.hostname === domain || location.hostname.endsWith('.' + domain));
  // Post containers first; the fallback is used only on pages with no such posts.
  const site = onHost('x.com', 'twitter.com') ? { posts: 'article[data-testid="tweet"]', fallback: 'main' }
    : onHost('linkedin.com') ? { posts: '.feed-shared-update-v2, .occludable-update', fallback: 'main' }
    : onHost('facebook.com') ? { posts: '[role="article"]', fallback: '[role="main"]' }
    : onHost('instagram.com') ? { posts: 'article', fallback: 'main' }
    : onHost('threads.net', 'threads.com') ? { posts: '[data-pressable-container]', fallback: 'main' }
    : null;
  if (!site) return;
  window.__agSocialOriginalsInstalled = true;
  /* @include lib/debug.js */

  const exact = new Set([
    'show original', 'see original', 'view original', 'show original text',
    'ver original', 'ver el original', 'mostrar original', 'mostrar el original',
    'mostrar o original', 'mostrar texto original', 'exibir original', 'ver texto original',
    "voir l'original", "afficher l'original", 'original anzeigen', 'original ansehen',
    'mostra originale', 'visualizza originale', 'показать оригинал',
    '原文を表示', '显示原文', '顯示原文', '원문 보기', 'orijinali göster',
    'pokaż oryginał', 'zobacz oryginał', 'toon origineel', 'origineel weergeven',
    'visa original', 'vis original', 'näytä alkuperäinen', 'xem bản gốc', 'lihat asli',
  ]);
  const normalize = value => (value || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ').replace(/’/g, "'");
  const near = el => {
    const rect = el.getBoundingClientRect();
    return rect.bottom >= -400 && rect.top <= innerHeight + 1200;
  };
  // Only controls that act in place: a real link would navigate away from the page.
  const navigates = el => el.tagName === 'A' && Boolean(el.getAttribute('href')) && el.getAttribute('href') !== '#';

  const clicked = new WeakSet();
  const run = () => {
    if (document.hidden) return;
    let scopes = document.querySelectorAll(site.posts);
    if (!scopes.length) scopes = document.querySelectorAll(site.fallback);
    let checked = 0;
    // Posts away from the viewport cost nothing, so long feeds cannot use up the budget.
    for (const scope of scopes) {
      if (!near(scope)) continue;
      for (const el of scope.querySelectorAll('button,[role="button"],a:not([href])')) {
        if (clicked.has(el) || !near(el)) continue;
        if (++checked > 700) return;
        if (!exact.has(normalize(el.textContent)) && !exact.has(normalize(el.getAttribute('aria-label')))) continue;
        if (navigates(el)) continue;
        clicked.add(el);
        el.click();
        agDebug('social-originals: showed original');
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
  document.addEventListener('visibilitychange', schedule);
  addEventListener('scroll', schedule, { passive: true });
  agDebug('social-originals: active');
  schedule();
})();
