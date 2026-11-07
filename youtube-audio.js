/*
 * YouTube original-audio preference for an AdGuard JavaScript rule.
 * Uses the YouTube player audio-track API, a technique also used by
 * zpix1/yt-anti-translate (MIT), without copying its implementation.
 */
(() => {
  'use strict';
  if (window.__agOriginalAudioInstalled) return;
  window.__agOriginalAudioInstalled = true;

  // Translation of the "Original" track label in commonly used UIs.
  const originalLabels = ['original', 'оригинал', 'オリジナル', '原始', '원본',
    'origineel', 'originale', 'oryginał', 'původní', 'αρχικό', 'orijinal',
    '原創', 'gốc', 'asli', 'מקורי', 'أصلي', 'मूल', 'मूळ',
    'ਪ੍ਰਮਾਣਿਕ', 'అసలు', 'மூலம்', 'মূল', 'അസലി', 'ต้นฉบับ'];

  let lastHandledVideoId = null;
  let busy = false;
  let timer;
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

  const run = async () => {
    if (busy) return;
    const player = document.querySelector('#movie_player');
    if (!player || !['getPlayerResponse', 'getAvailableAudioTracks',
      'getAudioTrack', 'setAudioTrack'].every(name => typeof player[name] === 'function')) return;
    busy = true;
    try {
      const response = await player.getPlayerResponse();
      const videoId = response?.videoDetails?.videoId;
      if (!videoId || videoId === lastHandledVideoId) return;
      const tracks = await player.getAvailableAudioTracks();
      const selected = await player.getAudioTrack();
      if (!Array.isArray(tracks) || !selected) return;
      const original = tracks.find(isOriginal);
      if (!original) return;
      if (selected.id !== original.id) await player.setAudioTrack(original);
      // Set at most once per video to avoid overriding later manual changes.
      lastHandledVideoId = videoId;
    } catch (_) {
      // YouTube's internal player API is undocumented; retry on navigation.
    } finally { busy = false; }
  };

  const schedule = () => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; run(); }, 350);
  };
  document.addEventListener('yt-navigate-finish', () => {
    lastHandledVideoId = null;
    schedule();
  });
  if (document.documentElement) {
    new MutationObserver(schedule).observe(document.documentElement,
      { childList: true, subtree: true });
  }
  // Some player updates do not produce DOM mutations.
  setInterval(run, 1800);
  schedule();
})();
