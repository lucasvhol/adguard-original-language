/*
 * OPTIONAL and experimental. Restores the video description and channel name on
 * YouTube watch pages from the player response, the data source also used by
 * zpix1/yt-anti-translate (MIT), without copying its implementation.
 * Lives in the optional filter because it rewrites YouTube's description markup:
 * hashtag and @mention links in a restored description become plain text.
 */
(() => {
  'use strict';
  if (location.hostname !== 'www.youtube.com' || window.__agOriginalDetailsInstalled) return;
  window.__agOriginalDetailsInstalled = true;
  /* @include lib/debug.js */

  const descriptionSelector = '#description-inline-expander yt-attributed-string';
  const channelSelector = 'ytd-watch-metadata ytd-video-owner-renderer ytd-channel-name a';
  const tokenPattern = /(https?:\/\/[^\s<>"']+)|(?:^|(?<=\s))((?:\d{1,2}:)?\d{1,2}:\d{2})(?=\s|$)/g;

  // Only letters and digits, so YouTube's shortened links and spacing do not count as differences.
  const fingerprint = text => text.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 40).toLocaleLowerCase();
  const toSeconds = stamp => stamp.split(':').reduce((total, part) => total * 60 + Number(part), 0);

  // Built with DOM calls only: YouTube enforces Trusted Types, and text stays text.
  const buildDescription = (text, player) => {
    const wrapper = document.createElement('span');
    wrapper.style.whiteSpace = 'pre-wrap';
    let position = 0;
    for (const match of text.matchAll(tokenPattern)) {
      wrapper.append(text.slice(position, match.index));
      const link = document.createElement('a');
      link.textContent = match[0];
      if (match[1]) {
        link.href = match[1];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        const seconds = toSeconds(match[2]);
        link.href = '#';
        link.addEventListener('click', event => { event.preventDefault(); player.seekTo?.(seconds, true); });
      }
      wrapper.append(link);
      position = match.index + match[0].length;
    }
    wrapper.append(text.slice(position));
    return wrapper;
  };

  const restore = async () => {
    if (document.hidden || location.pathname !== '/watch') return;
    const player = document.querySelector('#movie_player');
    if (typeof player?.getPlayerResponse !== 'function') return;
    try {
      const details = (await player.getPlayerResponse())?.videoDetails;
      if (!details || details.videoId !== new URL(location.href).searchParams.get('v')) return;
      const description = details.shortDescription;
      if (typeof description === 'string' && fingerprint(description)) {
        for (const el of document.querySelectorAll(descriptionSelector)) {
          if (fingerprint(el.textContent || '') === fingerprint(description)) continue;
          el.replaceChildren(buildDescription(description, player));
          agDebug('youtube-details: restored description', details.videoId);
        }
      }
      const channels = document.querySelectorAll(channelSelector);
      if (typeof details.author === 'string' && details.author && channels.length === 1 &&
        channels[0].textContent.trim() !== details.author) {
        channels[0].textContent = details.author;
        agDebug('youtube-details: restored channel name', details.author);
      }
    } catch (_) { /* YouTube's internal player API is undocumented. */ }
  };

  let timer;
  const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; restore(); }, 400); };
  document.addEventListener('yt-navigate-finish', schedule);
  document.addEventListener('visibilitychange', schedule);
  if (document.documentElement) {
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  }
  agDebug('youtube-details: active');
  schedule();
})();
