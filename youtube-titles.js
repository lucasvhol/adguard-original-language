/*
 * YouTube original-title restoration for an AdGuard JavaScript rule.
 * Requests YouTube's own oEmbed metadata (the approach used by
 * zpix1/yt-anti-translate). No third-party servers or API keys.
 * Desktop www.youtube.com only: mobile/embedded contexts have CORS limits.
 */
(() => {
  'use strict';
  if (location.hostname !== 'www.youtube.com' || window.__agOriginalTitlesInstalled) return;
  window.__agOriginalTitlesInstalled = true;

  const listSelector = [
    'ytd-rich-grid-media a#video-title-link',
    'ytd-rich-grid-media a#video-title',
    'ytd-video-renderer a#video-title',
    'ytd-grid-video-renderer a#video-title',
    'ytd-compact-video-renderer a#video-title',
    'ytd-playlist-video-renderer a#video-title',
    'ytd-playlist-panel-video-renderer a#video-title',
    'yt-lockup-view-model a.yt-lockup-metadata-view-model__title',
  ].join(',');
  const watchSelector = '#title h1 yt-formatted-string';
  const cache = new Map();
  const queued = new Set();
  const queue = [];
  let inFlight = 0;
  let timer;
  let lastUrl = location.href;

  const getId = (href) => {
    try {
      const url = new URL(href, location.href);
      if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null;
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v');
        return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null;
      }
      const match = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    } catch (_) { return null; }
  };

  const putTitle = (el, title) => {
    if (!el.isConnected || !title) return;
    // Preserve the anchor, its href, navigation handlers, and badge elements.
    const node = el.matches('a')
      ? (el.querySelector('yt-formatted-string, .yt-core-attributed-string') || el)
      : el;
    if (node.textContent?.trim() !== title) {
      node.textContent = title;
      if (el.matches('a')) el.title = title;
    }
  };

  const render = (id) => {
    const title = cache.get(id);
    if (typeof title !== 'string') return;
    for (const el of document.querySelectorAll(listSelector)) {
      if (getId(el.href) === id) putTitle(el, title);
    }
    if (getId(location.href) === id) {
      for (const el of document.querySelectorAll(watchSelector)) putTitle(el, title);
      // The document title is browser tab text, not part of the video metadata.
      const suffix = ' - YouTube';
      if (document.title && document.title.endsWith(suffix) && document.title !== title + suffix) document.title = title + suffix;
    }
  };

  const pump = () => {
    while (inFlight < 2 && queue.length) {
      const id = queue.shift();
      inFlight++;
      const url = '/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json';
      fetch(url, { credentials: 'same-origin' })
        .then(response => response.ok ? response.json() : null)
        .then(data => {
          cache.set(id, data && typeof data.title === 'string' ? data.title : null);
          render(id);
        })
        .catch(() => cache.set(id, null))
        .finally(() => { queued.delete(id); inFlight--; pump(); });
    }
  };
  const request = (id) => {
    if (!id || cache.has(id) || queued.has(id)) return;
    if (queued.size >= 80) return; // Bound initial concurrent-list workload.
    queued.add(id);
    queue.push(id);
    pump();
  };

  const scan = () => {
    if (lastUrl !== location.href) lastUrl = location.href;
    const watchId = getId(location.href);
    if (watchId) {
      request(watchId);
      render(watchId);
    }
    let count = 0;
    for (const el of document.querySelectorAll(listSelector)) {
      if (++count > 160) break;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > innerHeight + 800) continue;
      const id = getId(el.href);
      if (!id) continue;
      request(id);
      render(id);
    }
  };
  const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; scan(); }, 200); };
  document.addEventListener('yt-navigate-finish', schedule);
  if (document.documentElement) {
    new MutationObserver(schedule).observe(document.documentElement,
      { childList: true, subtree: true });
  }
  addEventListener('scroll', schedule, { passive: true });
  schedule();
})();
