/*
 * YouTube original-audio preference for an AdGuard JavaScript rule.
 * Uses the YouTube player audio-track API, a technique also used by
 * zpix1/yt-anti-translate (MIT), without copying its implementation.
 */
(() => {
  'use strict';
  if (window.__agOriginalAudioInstalled) return;
  if (['studio.youtube.com', 'accounts.youtube.com'].includes(location.hostname)) return;
  window.__agOriginalAudioInstalled = true;
  /* @include lib/debug.js */

  // Translation of the "Original" track label in commonly used UIs.
  const originalLabels = ['original', 'оригинал', 'オリジナル', '原始', '원본',
    'origineel', 'originale', 'oryginał', 'původní', 'αρχικό', 'orijinal',
    '原創', 'gốc', 'asli', 'מקורי', 'أصلي', 'मूल', 'मूळ',
    'ਪ੍ਰਮਾਣਿਕ', 'అసలు', 'மூலம்', 'মূল', 'അസലി', 'ต้นฉบับ'];
  const playerApi = ['getPlayerResponse', 'getAvailableAudioTracks', 'getAudioTrack', 'setAudioTrack'];
  // Tracks can load late, but most videos have no original track to find.
  const giveUpAfterMs = 15000;

  let lastHandledVideoId = null;
  let waitingVideoId = null;
  let waitingSince = 0;
  let busy = false;
  let timer;
  let poll = null;

  const startPolling = () => { if (poll === null) poll = setInterval(run, 1800); };
  const stopPolling = () => { if (poll !== null) { clearInterval(poll); poll = null; } };
  const markHandled = (videoId) => { lastHandledVideoId = videoId; waitingVideoId = null; stopPolling(); };

  const findPlayer = () => {
    const selectors = location.pathname?.startsWith('/shorts')
      ? ['#shorts-player', '#movie_player']
      : ['#movie_player', '#player-container-id'];
    for (const selector of selectors) {
      const player = document.querySelector(selector);
      if (player && playerApi.every(name => typeof player[name] === 'function')) return player;
    }
    return null;
  };

  const isOriginal = (track) => {
    if (!track || typeof track !== 'object') return false;
    const id = String(track.id || '');
    if (id.includes(';')) {
      try {
        const payload = atob(id.split(';')[1]);
        if (/\boriginal\b/i.test(payload)) return true;
      } catch (_) { /* YouTube can change the track ID representation. */ }
    }
    for (const value of Object.values(track)) {
      if (!value || typeof value.name !== 'string') continue;
      const name = value.name.toLocaleLowerCase();
      if (originalLabels.some(label => name.includes(label))) return true;
    }
    return false;
  };

  async function run() {
    if (busy) return;
    const player = findPlayer();
    if (!player) return;
    busy = true;
    try {
      const response = await player.getPlayerResponse();
      const videoId = response?.videoDetails?.videoId;
      if (!videoId || videoId === lastHandledVideoId) return;
      if (videoId !== waitingVideoId) {
        waitingVideoId = videoId;
        waitingSince = Date.now();
        startPolling();
      }
      const tracks = await player.getAvailableAudioTracks();
      const selected = await player.getAudioTrack();
      const original = Array.isArray(tracks) && selected ? tracks.find(isOriginal) : null;
      if (!original) {
        if (Date.now() - waitingSince >= giveUpAfterMs) markHandled(videoId);
        return;
      }
      if (selected.id !== original.id) {
        await player.setAudioTrack(original);
        agDebug('youtube-audio: switched to original track', videoId);
      }
      // Set at most once per video to avoid overriding later manual changes.
      markHandled(videoId);
    } catch (_) {
      // YouTube's internal player API is undocumented; retry on navigation.
    } finally { busy = false; }
  }

  const schedule = () => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; run(); }, 350);
  };
  document.addEventListener('yt-navigate-finish', () => {
    lastHandledVideoId = null;
    waitingVideoId = null;
    startPolling();
    schedule();
  });
  if (document.documentElement) {
    new MutationObserver(schedule).observe(document.documentElement,
      { childList: true, subtree: true });
  }
  // Some player updates do not produce DOM mutations. Stops once the video is resolved.
  startPolling();
  agDebug('youtube-audio: active');
  schedule();
})();
