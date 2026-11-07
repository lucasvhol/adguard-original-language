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
  /* @include lib/debug.js */

  // Links whose own text is the title.
  const linkSelector = [
    'ytd-rich-grid-media a#video-title-link',
    'ytd-rich-grid-media a#video-title',
    'ytd-video-renderer a#video-title',
    'ytd-grid-video-renderer a#video-title',
    'ytd-compact-video-renderer a#video-title',
    'ytd-playlist-video-renderer a#video-title',
    'ytd-playlist-panel-video-renderer a#video-title',
    'yt-lockup-view-model a.yt-lockup-metadata-view-model__title',
    'yt-lockup-view-model a.ytLockupMetadataViewModelTitle',
    'a.ytp-title-link',
  ].join(',');
  // Player end-screen links, which hold the title in a child element.
  const cardSelector = [
    'a.ytp-videowall-still', 'a.ytp-ce-covering-overlay',
    'a.ytp-suggestion-link', 'a.ytp-autonav-endscreen-link-container',
  ].join(',');
  const cardTitleSelector = [
    'span.ytp-videowall-still-info-title', 'span.ytp-modern-videowall-still-info-title',
    'div.ytp-ce-video-title', 'div.ytp-suggestion-title', 'div.ytp-autonav-endscreen-upnext-title',
  ].join(',');
  // Titles of the video on the current page.
  const pageTitleSelector = [
    '#title h1 yt-formatted-string',
    'yt-shorts-video-title-view-model > h1.ytShortsVideoTitleViewModelShortsVideoTitle',
    'yt-shorts-video-title-view-model > h2 > span',
  ].join(',');
  const miniplayerSelector = 'ytd-miniplayer-info-bar .ytdMiniplayerInfoBarTitle';

  const maxRetries = 3;
  const cache = new Map();
  const failures = new Map();
  const queued = new Set();
  const queue = [];
  const parsedLinks = new WeakMap();
  let inFlight = 0;
  let timer;

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
  // YouTube reuses row elements, so a remembered id is only valid for the same href.
  const idOfLink = (el) => {
    const known = parsedLinks.get(el);
    if (known && known.href === el.href) return known.id;
    const id = getId(el.href);
    parsedLinks.set(el, { href: el.href, id });
    return id;
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
      agDebug('youtube-titles: restored', title);
    }
  };

  const nearViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom >= -200 && rect.top <= innerHeight + 800;
  };

  const fail = (id) => {
    const count = (failures.get(id)?.count || 0) + 1;
    if (count >= maxRetries) { cache.set(id, null); failures.delete(id); return; }
    const delay = 5000 * 2 ** count;
    failures.set(id, { count, retryAt: Date.now() + delay });
    setTimeout(schedule, delay);
  };

  const pump = () => {
    while (inFlight < 2 && queue.length) {
      const id = queue.shift();
      inFlight++;
      const url = '/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json';
      fetch(url, { credentials: 'same-origin' })
        .then(response => {
          if (response.ok) return response.json();
          // 401/403/404 are final for this video; rate limits and 5xx are temporary.
          if ([401, 403, 404].includes(response.status)) { cache.set(id, null); return null; }
          fail(id);
          return null;
        })
        .then(data => {
          if (!data) return;
          if (typeof data.title === 'string') { cache.set(id, data.title); failures.delete(id); schedule(); } else cache.set(id, null);
        })
        .catch(() => fail(id))
        .finally(() => { queued.delete(id); inFlight--; pump(); });
    }
  };
  const request = (id) => {
    if (!id || cache.has(id) || queued.has(id)) return;
    if (Date.now() < (failures.get(id)?.retryAt || 0)) return;
    if (queued.size >= 80) return; // Bound initial concurrent-list workload.
    queued.add(id);
    queue.push(id);
    pump();
  };

  // Known titles apply anywhere on the page; only unknown ones near the viewport are fetched.
  const apply = (el, id, target) => {
    if (!id) return;
    const title = cache.get(id);
    if (typeof title === 'string') putTitle(target, title);
    else if (!cache.has(id) && nearViewport(el)) request(id);
  };

  const scan = () => {
    if (document.hidden) return;
    const pageId = getId(location.href);
    if (pageId) {
      request(pageId);
      const title = cache.get(pageId);
      if (typeof title === 'string') {
        for (const el of document.querySelectorAll(pageTitleSelector)) putTitle(el, title);
        // The document title is browser tab text, not part of the video metadata.
        const suffix = ' - YouTube';
        const unread = /^\(\d+\+?\) /.exec(document.title)?.[0] || '';
        const wanted = unread + title + suffix;
        if (document.title && document.title.endsWith(suffix) && document.title !== wanted) document.title = wanted;
      }
    }
    for (const el of document.querySelectorAll(linkSelector)) apply(el, idOfLink(el), el);
    for (const el of document.querySelectorAll(cardSelector)) {
      const target = el.querySelector(cardTitleSelector);
      if (target) apply(el, idOfLink(el), target);
    }
    const mini = document.querySelector(miniplayerSelector);
    if (mini) {
      const id = document.querySelector('#movie_player')?.getVideoData?.()?.video_id;
      if (id) { request(id); apply(mini, id, mini); }
    }
  };
  const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; scan(); }, 200); };
  document.addEventListener('yt-navigate-finish', schedule);
  document.addEventListener('visibilitychange', schedule);
  if (document.documentElement) {
    new MutationObserver(schedule).observe(document.documentElement,
      { childList: true, subtree: true });
  }
  addEventListener('scroll', schedule, { passive: true });
  agDebug('youtube-titles: active');
  schedule();
})();
