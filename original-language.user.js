// ==UserScript==
// @name         Original Language
// @namespace    https://github.com/lucasvhol/adguard-original-language
// @version      0.3.0
// @description  Stop unwanted automatic translation on Google, YouTube, Reddit and social sites.
// @homepageURL  https://github.com/lucasvhol/adguard-original-language
// @updateURL    https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/original-language.user.js
// @downloadURL  https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/original-language.user.js
// @license      MIT
// @run-at       document-start
// @grant        none
// @match        *://*.reddit.com/*
// @match        *://www.google.ad/*
// @match        *://www.google.ae/*
// @match        *://www.google.al/*
// @match        *://www.google.am/*
// @match        *://www.google.as/*
// @match        *://www.google.at/*
// @match        *://www.google.az/*
// @match        *://www.google.ba/*
// @match        *://www.google.be/*
// @match        *://www.google.bf/*
// @match        *://www.google.bg/*
// @match        *://www.google.bi/*
// @match        *://www.google.bj/*
// @match        *://www.google.bs/*
// @match        *://www.google.bt/*
// @match        *://www.google.by/*
// @match        *://www.google.ca/*
// @match        *://www.google.cat/*
// @match        *://www.google.cd/*
// @match        *://www.google.cf/*
// @match        *://www.google.cg/*
// @match        *://www.google.ch/*
// @match        *://www.google.ci/*
// @match        *://www.google.cl/*
// @match        *://www.google.cm/*
// @match        *://www.google.cn/*
// @match        *://www.google.co.ao/*
// @match        *://www.google.co.bw/*
// @match        *://www.google.co.ck/*
// @match        *://www.google.co.cr/*
// @match        *://www.google.co.id/*
// @match        *://www.google.co.il/*
// @match        *://www.google.co.in/*
// @match        *://www.google.co.jp/*
// @match        *://www.google.co.ke/*
// @match        *://www.google.co.kr/*
// @match        *://www.google.co.ls/*
// @match        *://www.google.co.ma/*
// @match        *://www.google.co.mz/*
// @match        *://www.google.co.nz/*
// @match        *://www.google.co.th/*
// @match        *://www.google.co.tz/*
// @match        *://www.google.co.ug/*
// @match        *://www.google.co.uk/*
// @match        *://www.google.co.uz/*
// @match        *://www.google.co.ve/*
// @match        *://www.google.co.vi/*
// @match        *://www.google.co.za/*
// @match        *://www.google.co.zm/*
// @match        *://www.google.co.zw/*
// @match        *://www.google.com/*
// @match        *://www.google.com.af/*
// @match        *://www.google.com.ag/*
// @match        *://www.google.com.ar/*
// @match        *://www.google.com.au/*
// @match        *://www.google.com.bd/*
// @match        *://www.google.com.bh/*
// @match        *://www.google.com.bn/*
// @match        *://www.google.com.bo/*
// @match        *://www.google.com.br/*
// @match        *://www.google.com.bz/*
// @match        *://www.google.com.co/*
// @match        *://www.google.com.cu/*
// @match        *://www.google.com.cy/*
// @match        *://www.google.com.do/*
// @match        *://www.google.com.ec/*
// @match        *://www.google.com.eg/*
// @match        *://www.google.com.et/*
// @match        *://www.google.com.fj/*
// @match        *://www.google.com.gh/*
// @match        *://www.google.com.gi/*
// @match        *://www.google.com.gt/*
// @match        *://www.google.com.hk/*
// @match        *://www.google.com.jm/*
// @match        *://www.google.com.kh/*
// @match        *://www.google.com.kw/*
// @match        *://www.google.com.lb/*
// @match        *://www.google.com.ly/*
// @match        *://www.google.com.mm/*
// @match        *://www.google.com.mt/*
// @match        *://www.google.com.mx/*
// @match        *://www.google.com.my/*
// @match        *://www.google.com.na/*
// @match        *://www.google.com.ng/*
// @match        *://www.google.com.ni/*
// @match        *://www.google.com.np/*
// @match        *://www.google.com.om/*
// @match        *://www.google.com.pa/*
// @match        *://www.google.com.pe/*
// @match        *://www.google.com.pg/*
// @match        *://www.google.com.ph/*
// @match        *://www.google.com.pk/*
// @match        *://www.google.com.pr/*
// @match        *://www.google.com.py/*
// @match        *://www.google.com.qa/*
// @match        *://www.google.com.sa/*
// @match        *://www.google.com.sb/*
// @match        *://www.google.com.sg/*
// @match        *://www.google.com.sl/*
// @match        *://www.google.com.sv/*
// @match        *://www.google.com.tj/*
// @match        *://www.google.com.tr/*
// @match        *://www.google.com.tw/*
// @match        *://www.google.com.ua/*
// @match        *://www.google.com.uy/*
// @match        *://www.google.com.vc/*
// @match        *://www.google.com.vn/*
// @match        *://www.google.cv/*
// @match        *://www.google.cz/*
// @match        *://www.google.de/*
// @match        *://www.google.dj/*
// @match        *://www.google.dk/*
// @match        *://www.google.dm/*
// @match        *://www.google.dz/*
// @match        *://www.google.ee/*
// @match        *://www.google.es/*
// @match        *://www.google.fi/*
// @match        *://www.google.fm/*
// @match        *://www.google.fr/*
// @match        *://www.google.ga/*
// @match        *://www.google.ge/*
// @match        *://www.google.gg/*
// @match        *://www.google.gl/*
// @match        *://www.google.gm/*
// @match        *://www.google.gr/*
// @match        *://www.google.gy/*
// @match        *://www.google.hn/*
// @match        *://www.google.hr/*
// @match        *://www.google.ht/*
// @match        *://www.google.hu/*
// @match        *://www.google.ie/*
// @match        *://www.google.im/*
// @match        *://www.google.iq/*
// @match        *://www.google.is/*
// @match        *://www.google.it/*
// @match        *://www.google.je/*
// @match        *://www.google.jo/*
// @match        *://www.google.kg/*
// @match        *://www.google.ki/*
// @match        *://www.google.kz/*
// @match        *://www.google.la/*
// @match        *://www.google.li/*
// @match        *://www.google.lk/*
// @match        *://www.google.lt/*
// @match        *://www.google.lu/*
// @match        *://www.google.lv/*
// @match        *://www.google.md/*
// @match        *://www.google.me/*
// @match        *://www.google.mg/*
// @match        *://www.google.mk/*
// @match        *://www.google.ml/*
// @match        *://www.google.mn/*
// @match        *://www.google.mu/*
// @match        *://www.google.mv/*
// @match        *://www.google.mw/*
// @match        *://www.google.ne/*
// @match        *://www.google.nl/*
// @match        *://www.google.no/*
// @match        *://www.google.nr/*
// @match        *://www.google.nu/*
// @match        *://www.google.pl/*
// @match        *://www.google.pn/*
// @match        *://www.google.ps/*
// @match        *://www.google.pt/*
// @match        *://www.google.ro/*
// @match        *://www.google.rs/*
// @match        *://www.google.ru/*
// @match        *://www.google.rw/*
// @match        *://www.google.sc/*
// @match        *://www.google.se/*
// @match        *://www.google.sh/*
// @match        *://www.google.si/*
// @match        *://www.google.sk/*
// @match        *://www.google.sm/*
// @match        *://www.google.sn/*
// @match        *://www.google.so/*
// @match        *://www.google.sr/*
// @match        *://www.google.st/*
// @match        *://www.google.td/*
// @match        *://www.google.tg/*
// @match        *://www.google.tl/*
// @match        *://www.google.tm/*
// @match        *://www.google.tn/*
// @match        *://www.google.to/*
// @match        *://www.google.tt/*
// @match        *://www.google.vu/*
// @match        *://www.google.ws/*
// @match        *://*.translate.google.com/*
// @match        *://*.translate.goog/*
// @match        *://www.youtube.com/*
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @match        *://*.linkedin.com/*
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @match        *://*.threads.net/*
// @match        *://*.threads.com/*
// ==/UserScript==

// Generated by build.py. Edit the source files, not this file.
(() => {
  'use strict';
  // Set to true for the experimental social and YouTube description features.
  const ENABLE_OPTIONAL = false;
  const on = domains => domains.some(domain => location.hostname === domain || location.hostname.endsWith(`.${domain}`));
  // reddit-links.js
  if (on(["reddit.com"])) { (() => { 'use strict'; if (window.__agOriginalRedditInstalled) return; window.__agOriginalRedditInstalled = true; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const clean = href => { try { const url = new URL(href, location.href); if (!url.searchParams.has('tl')) return null; url.searchParams.delete('tl'); return url.href; } catch (_) { return null; } }; const current = clean(location.href); if (current) { agDebug('reddit: reloading without tl'); location.replace(current); return; } const fixLink = event => { const link = event.target?.closest?.('a[href*="tl="]'); if (!link) return; const cleaned = clean(link.href); if (cleaned) link.href = cleaned; }; document.addEventListener('click', fixLink, true); document.addEventListener('auxclick', fixLink, true); for (const method of ['pushState', 'replaceState']) { const native = history[method]; history[method] = function (state, title, url) { const cleaned = url === undefined || url === null ? null : clean(String(url)); return native.call(this, state, title, cleaned || url); }; } })(); }
  // google-search.js
  if (on(["www.google.ad", "www.google.ae", "www.google.al", "www.google.am", "www.google.as", "www.google.at", "www.google.az", "www.google.ba", "www.google.be", "www.google.bf", "www.google.bg", "www.google.bi", "www.google.bj", "www.google.bs", "www.google.bt", "www.google.by", "www.google.ca", "www.google.cat", "www.google.cd", "www.google.cf", "www.google.cg", "www.google.ch", "www.google.ci", "www.google.cl", "www.google.cm", "www.google.cn", "www.google.co.ao", "www.google.co.bw", "www.google.co.ck", "www.google.co.cr", "www.google.co.id", "www.google.co.il", "www.google.co.in", "www.google.co.jp", "www.google.co.ke", "www.google.co.kr", "www.google.co.ls", "www.google.co.ma", "www.google.co.mz", "www.google.co.nz", "www.google.co.th", "www.google.co.tz", "www.google.co.ug", "www.google.co.uk", "www.google.co.uz", "www.google.co.ve", "www.google.co.vi", "www.google.co.za", "www.google.co.zm", "www.google.co.zw", "www.google.com", "www.google.com.af", "www.google.com.ag", "www.google.com.ar", "www.google.com.au", "www.google.com.bd", "www.google.com.bh", "www.google.com.bn", "www.google.com.bo", "www.google.com.br", "www.google.com.bz", "www.google.com.co", "www.google.com.cu", "www.google.com.cy", "www.google.com.do", "www.google.com.ec", "www.google.com.eg", "www.google.com.et", "www.google.com.fj", "www.google.com.gh", "www.google.com.gi", "www.google.com.gt", "www.google.com.hk", "www.google.com.jm", "www.google.com.kh", "www.google.com.kw", "www.google.com.lb", "www.google.com.ly", "www.google.com.mm", "www.google.com.mt", "www.google.com.mx", "www.google.com.my", "www.google.com.na", "www.google.com.ng", "www.google.com.ni", "www.google.com.np", "www.google.com.om", "www.google.com.pa", "www.google.com.pe", "www.google.com.pg", "www.google.com.ph", "www.google.com.pk", "www.google.com.pr", "www.google.com.py", "www.google.com.qa", "www.google.com.sa", "www.google.com.sb", "www.google.com.sg", "www.google.com.sl", "www.google.com.sv", "www.google.com.tj", "www.google.com.tr", "www.google.com.tw", "www.google.com.ua", "www.google.com.uy", "www.google.com.vc", "www.google.com.vn", "www.google.cv", "www.google.cz", "www.google.de", "www.google.dj", "www.google.dk", "www.google.dm", "www.google.dz", "www.google.ee", "www.google.es", "www.google.fi", "www.google.fm", "www.google.fr", "www.google.ga", "www.google.ge", "www.google.gg", "www.google.gl", "www.google.gm", "www.google.gr", "www.google.gy", "www.google.hn", "www.google.hr", "www.google.ht", "www.google.hu", "www.google.ie", "www.google.im", "www.google.iq", "www.google.is", "www.google.it", "www.google.je", "www.google.jo", "www.google.kg", "www.google.ki", "www.google.kz", "www.google.la", "www.google.li", "www.google.lk", "www.google.lt", "www.google.lu", "www.google.lv", "www.google.md", "www.google.me", "www.google.mg", "www.google.mk", "www.google.ml", "www.google.mn", "www.google.mu", "www.google.mv", "www.google.mw", "www.google.ne", "www.google.nl", "www.google.no", "www.google.nr", "www.google.nu", "www.google.pl", "www.google.pn", "www.google.ps", "www.google.pt", "www.google.ro", "www.google.rs", "www.google.ru", "www.google.rw", "www.google.sc", "www.google.se", "www.google.sh", "www.google.si", "www.google.sk", "www.google.sm", "www.google.sn", "www.google.so", "www.google.sr", "www.google.st", "www.google.td", "www.google.tg", "www.google.tl", "www.google.tm", "www.google.tn", "www.google.to", "www.google.tt", "www.google.vu", "www.google.ws"])) { (() => { 'use strict'; if (window.__agOriginalGoogleSearchInstalled) return; if (location.pathname !== '/search' && !(location.pathname === '/' && new URL(location.href).searchParams.has('q'))) return; window.__agOriginalGoogleSearchInstalled = true; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const gooSuffix = '.translate.goog'; const isTranslatorHost = host => host === 'translate.google.com' || host === 'translate.goog' || host.endsWith(gooSuffix); const isSafeOriginal = url => ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password && !isTranslatorHost(url.hostname); const decodeGooHost = url => { let prefix = url.hostname.slice(0, -gooSuffix.length); const encodings = (url.searchParams.get('_x_tr_enc') || '').split(','); prefix = (url.searchParams.get('_x_tr_hp') || '') + prefix; if (encodings.includes('1') && prefix.startsWith('1-')) prefix = prefix.slice(2); const isIdn = encodings.includes('0') && prefix.startsWith('0-'); if (isIdn) prefix = prefix.slice(2); const host = (isIdn ? 'xn--' : '') + prefix.replace(/\b-\b/g, '.').replace(/--/g, '-'); return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : null; }; const getOriginalUrl = href => { try { const url = new URL(href, location.href); if (url.hostname === 'translate.google.com') { if (!['/translate', '/website'].includes(url.pathname)) return null; const target = url.searchParams.get('u'); if (!target) return null; const original = new URL(target); return isSafeOriginal(original) ? original.href : null; } if (!url.hostname.endsWith(gooSuffix)) return null; const host = decodeGooHost(url); if (!host) return null; const scheme = url.searchParams.get('_x_tr_sch') === 'http' ? 'http:' : 'https:'; const query = url.search.slice(1).split('&').filter(part => part && !part.startsWith('_x_tr_')).join('&'); const original = new URL(scheme + '//' + host + url.pathname + (query ? '?' + query : '') + url.hash); return isSafeOriginal(original) ? original.href : null; } catch (_) { return null; } }; const translatedBlocks = new WeakSet(); const translatedLinks = 'a[href*="translate.google.com/translate"],a[href*="translate.google.com/website"],a[href*=".translate.goog"]'; const hide = el => { if (el.style.getPropertyValue('display') !== 'none' || el.style.getPropertyPriority('display') !== 'important') { el.style.setProperty('display', 'none', 'important'); } }; const show = el => { if (el.hidden) el.hidden = false; if (el.style.getPropertyValue('display') === 'none') el.style.removeProperty('display'); }; const restore = () => { const translatedContainers = new Set(); const groupParents = new Set(); for (const block of document.querySelectorAll('.uIV6Ge')) { if (block.parentElement) groupParents.add(block.parentElement); } for (const parent of groupParents) { const blocks = Array.from(parent.children).filter(el => el.classList?.contains('uIV6Ge')); if (blocks.length < 2) continue; const translated = blocks.find(block => translatedBlocks.has(block) || Array.from(block.querySelectorAll('a[href]')).some(a => getOriginalUrl(a.href))); const original = blocks.find(block => block !== translated && block.querySelector('a[href]')); if (!translated || !original) continue; translatedBlocks.add(translated); hide(translated); show(original); const container = parent.closest('.MjjYud, [data-dsrp]'); if (container) translatedContainers.add(container); } for (const container of translatedContainers) { for (const wrapper of container.querySelectorAll('.VwiC3b')) { const snippets = Array.from(wrapper.querySelectorAll('.Pa9Ggf')); if (snippets.length < 2) continue; const laterHidden = snippets.slice(1).some(el => el.hidden || el.style.getPropertyValue('display') === 'none'); if (!laterHidden) continue; hide(snippets[0]); snippets.slice(1).forEach(show); } for (const bar of container.querySelectorAll('.nlNnsd')) hide(bar); } let rewritten = 0; for (const a of document.querySelectorAll(translatedLinks)) { const original = getOriginalUrl(a.href); if (original && a.href !== original) { a.href = original; rewritten++; } } if (translatedContainers.size || rewritten) agDebug('google-search: restored', translatedContainers.size, 'results,', rewritten, 'links'); }; let pending = false; const schedule = () => { if (pending) return; pending = true; setTimeout(() => { pending = false; restore(); }, 120); }; const observe = () => { const root = document.body || document.documentElement; if (!root) return; new MutationObserver(mutations => { if (mutations.some(m => m.type === 'childList' && m.addedNodes.length > 0 || m.type === 'attributes' && m.attributeName === 'style' && (m.target.classList?.contains('uIV6Ge') || m.target.classList?.contains('Pa9Ggf')))) schedule(); }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); }; if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => { restore(); observe(); }, { once: true }); } else { restore(); observe(); } window.addEventListener('pageshow', schedule); })(); }
  // google-proxy.js
  if (on(["translate.google.com", "translate.goog"])) { (() => { 'use strict'; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const gooSuffix = '.translate.goog'; const isTranslatorHost = host => host === 'translate.google.com' || host === 'translate.goog' || host.endsWith(gooSuffix); const isSafeOriginal = url => ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password && !isTranslatorHost(url.hostname); const decodeGooHost = url => { let prefix = url.hostname.slice(0, -gooSuffix.length); const encodings = (url.searchParams.get('_x_tr_enc') || '').split(','); prefix = (url.searchParams.get('_x_tr_hp') || '') + prefix; if (encodings.includes('1') && prefix.startsWith('1-')) prefix = prefix.slice(2); const isIdn = encodings.includes('0') && prefix.startsWith('0-'); if (isIdn) prefix = prefix.slice(2); const host = (isIdn ? 'xn--' : '') + prefix.replace(/\b-\b/g, '.').replace(/--/g, '-'); return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : null; }; const getOriginalUrl = href => { try { const url = new URL(href, location.href); if (url.hostname === 'translate.google.com') { if (!['/translate', '/website'].includes(url.pathname)) return null; const target = url.searchParams.get('u'); if (!target) return null; const original = new URL(target); return isSafeOriginal(original) ? original.href : null; } if (!url.hostname.endsWith(gooSuffix)) return null; const host = decodeGooHost(url); if (!host) return null; const scheme = url.searchParams.get('_x_tr_sch') === 'http' ? 'http:' : 'https:'; const query = url.search.slice(1).split('&').filter(part => part && !part.startsWith('_x_tr_')).join('&'); const original = new URL(scheme + '//' + host + url.pathname + (query ? '?' + query : '') + url.hash); return isSafeOriginal(original) ? original.href : null; } catch (_) { return null; } }; const keepKey = 'agKeepTranslation'; const keepsTranslation = () => { const marked = new URL(location.href).hash.includes('keep-translation'); try { if (marked) sessionStorage.setItem(keepKey, '1'); return marked || sessionStorage.getItem(keepKey) === '1'; } catch (_) { return marked; } }; if (keepsTranslation()) { agDebug('google-proxy: translation kept'); return; } const original = getOriginalUrl(location.href); if (!original || original === location.href) return; agDebug('google-proxy: leaving translated page', original); location.replace(original); })(); }
  // youtube-titles.js
  if (on(["www.youtube.com"])) { (() => { 'use strict'; if (location.hostname !== 'www.youtube.com' || window.__agOriginalTitlesInstalled) return; window.__agOriginalTitlesInstalled = true; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const linkSelector = [ 'ytd-rich-grid-media a#video-title-link', 'ytd-rich-grid-media a#video-title', 'ytd-video-renderer a#video-title', 'ytd-grid-video-renderer a#video-title', 'ytd-compact-video-renderer a#video-title', 'ytd-playlist-video-renderer a#video-title', 'ytd-playlist-panel-video-renderer a#video-title', 'yt-lockup-view-model a.yt-lockup-metadata-view-model__title', 'yt-lockup-view-model a.ytLockupMetadataViewModelTitle', 'a.ytp-title-link', ].join(','); const cardSelector = [ 'a.ytp-videowall-still', 'a.ytp-ce-covering-overlay', 'a.ytp-suggestion-link', 'a.ytp-autonav-endscreen-link-container', ].join(','); const cardTitleSelector = [ 'span.ytp-videowall-still-info-title', 'span.ytp-modern-videowall-still-info-title', 'div.ytp-ce-video-title', 'div.ytp-suggestion-title', 'div.ytp-autonav-endscreen-upnext-title', ].join(','); const pageTitleSelector = [ '#title h1 yt-formatted-string', 'yt-shorts-video-title-view-model > h1.ytShortsVideoTitleViewModelShortsVideoTitle', 'yt-shorts-video-title-view-model > h2 > span', ].join(','); const miniplayerSelector = 'ytd-miniplayer-info-bar .ytdMiniplayerInfoBarTitle'; const maxRetries = 3; const cache = new Map(); const failures = new Map(); const queued = new Set(); const queue = []; const parsedLinks = new WeakMap(); const lastWritten = new WeakMap(); const maxCachedTitles = 500; const remember = (id, title) => { cache.delete(id); cache.set(id, title); if (cache.size > maxCachedTitles) cache.delete(cache.keys().next().value); }; let inFlight = 0; let timer; const getId = (href) => { try { const url = new URL(href, location.href); if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null; if (url.pathname === '/watch') { const id = url.searchParams.get('v'); return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null; } const match = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/); return match ? match[1] : null; } catch (_) { return null; } }; const idOfLink = (el) => { const known = parsedLinks.get(el); if (known && known.href === el.href) return known.id; const id = getId(el.href); parsedLinks.set(el, { href: el.href, id }); return id; }; const putTitle = (el, title) => { if (!el.isConnected || typeof title !== 'string' || !title.trim()) return; const node = el.matches('a') ? (el.querySelector('yt-formatted-string, .yt-core-attributed-string') || el) : el; const current = node.textContent?.trim(); if (!current || current === title) return; const walker = node.ownerDocument?.createTreeWalker?.(node, 4); if (!walker) return; let leaf = null; for (let text = walker.nextNode(); text; text = walker.nextNode()) { if (!text.nodeValue?.trim()) continue; if (leaf) return; leaf = text; } if (!leaf || leaf.nodeValue.trim() !== current) return; leaf.nodeValue = title; lastWritten.set(leaf, title); if (el.matches('a')) el.title = title; agDebug('youtube-titles: restored', title); }; const nearViewport = (el) => { const rect = el.getBoundingClientRect(); return rect.bottom >= -200 && rect.top <= innerHeight + 800; }; const fail = (id) => { const count = (failures.get(id)?.count || 0) + 1; if (count >= maxRetries) { remember(id, null); failures.delete(id); return; } const delay = 5000 * 2 ** count; failures.set(id, { count, retryAt: Date.now() + delay }); setTimeout(schedule, delay); }; const pump = () => { while (inFlight < 2 && queue.length) { const id = queue.shift(); inFlight++; const url = '/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json'; fetch(url, { credentials: 'same-origin' }) .then(response => { if (response.ok) return response.json(); if ([401, 403, 404].includes(response.status)) { remember(id, null); return null; } fail(id); return null; }) .then(data => { if (!data) return; if (typeof data.title === 'string' && data.title.trim()) { remember(id, data.title.trim()); failures.delete(id); schedule(); } else remember(id, null); }) .catch(() => fail(id)) .finally(() => { queued.delete(id); inFlight--; pump(); }); } }; const request = (id) => { if (!id || cache.has(id) || queued.has(id)) return; if (Date.now() < (failures.get(id)?.retryAt || 0)) return; if (queued.size >= 80) return; queued.add(id); queue.push(id); pump(); }; const apply = (el, id, target) => { if (!id) return; const title = cache.get(id); if (typeof title === 'string') putTitle(target, title); else if (!cache.has(id) && nearViewport(el)) request(id); }; const scan = () => { if (document.hidden) return; const pageId = getId(location.href); if (pageId) { request(pageId); const title = cache.get(pageId); if (typeof title === 'string') { for (const el of document.querySelectorAll(pageTitleSelector)) putTitle(el, title); const suffix = ' - YouTube'; const unread = /^\(\d+\+?\) /.exec(document.title)?.[0] || ''; const wanted = unread + title + suffix; if (document.title && document.title.endsWith(suffix) && document.title !== wanted) document.title = wanted; } } for (const el of document.querySelectorAll(linkSelector)) apply(el, idOfLink(el), el); for (const el of document.querySelectorAll(cardSelector)) { const target = el.querySelector(cardTitleSelector); if (target) apply(el, idOfLink(el), target); } const mini = document.querySelector(miniplayerSelector); if (mini) { const id = document.querySelector('#movie_player')?.getVideoData?.()?.video_id; if (id) { request(id); apply(mini, id, mini); } } }; const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; scan(); }, 200); }; document.addEventListener('yt-navigate-finish', schedule); document.addEventListener('visibilitychange', schedule); const observedTitles = [linkSelector, cardSelector, pageTitleSelector, miniplayerSelector].join(','); const titleHosts = [ 'ytd-rich-grid-media', 'ytd-video-renderer', 'ytd-grid-video-renderer', 'ytd-compact-video-renderer', 'ytd-playlist-video-renderer', 'ytd-playlist-panel-video-renderer', 'yt-lockup-view-model', 'ytd-watch-metadata', 'yt-shorts-video-title-view-model', 'ytd-miniplayer-info-bar', '.ytp-title', ].join(','); const titleMutation = mutation => { if (mutation.type === 'characterData') { const text = mutation.target; return lastWritten.get(text) !== text.nodeValue && Boolean(text.parentElement?.closest?.(observedTitles)); } if (mutation.type !== 'childList' || !mutation.addedNodes.length) return false; if (mutation.target.nodeType === 1 && mutation.target.closest?.(observedTitles)) return true; return Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && (node.matches?.(observedTitles) || node.matches?.(titleHosts) || Boolean(node.querySelector?.(observedTitles)))); }; if (document.documentElement) { new MutationObserver(mutations => { if (mutations.some(titleMutation)) schedule(); }).observe(document.documentElement, { childList: true, characterData: true, subtree: true, }); } addEventListener('scroll', schedule, { passive: true }); agDebug('youtube-titles: active'); schedule(); })(); }
  // youtube-audio.js
  if (on(["youtube.com", "youtube-nocookie.com"])) { (() => { 'use strict'; if (window.__agOriginalAudioInstalled) return; if (['studio.youtube.com', 'accounts.youtube.com'].includes(location.hostname)) return; window.__agOriginalAudioInstalled = true; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const originalLabels = ['original', 'оригинал', 'オリジナル', '原始', '원본', 'origineel', 'originale', 'oryginał', 'původní', 'αρχικό', 'orijinal', '原創', 'gốc', 'asli', 'מקורי', 'أصلي', 'मूल', 'मूळ', 'ਪ੍ਰਮਾਣਿਕ', 'అసలు', 'மூலம்', 'মূল', 'അസലി', 'ต้นฉบับ']; const playerApi = ['getPlayerResponse', 'getAvailableAudioTracks', 'getAudioTrack', 'setAudioTrack']; const giveUpAfterMs = 15000; let lastHandledVideoId = null; let waitingVideoId = null; let waitingSince = 0; let busy = false; let timer; let poll = null; const startPolling = () => { if (poll === null) poll = setInterval(run, 1800); }; const stopPolling = () => { if (poll !== null) { clearInterval(poll); poll = null; } }; const markHandled = (videoId) => { lastHandledVideoId = videoId; waitingVideoId = null; stopPolling(); }; const findPlayer = () => { const selectors = location.pathname?.startsWith('/shorts') ? ['#shorts-player', '#movie_player'] : ['#movie_player', '#player-container-id']; for (const selector of selectors) { const player = document.querySelector(selector); if (player && playerApi.every(name => typeof player[name] === 'function')) return player; } return null; }; const isOriginal = (track) => { if (!track || typeof track !== 'object') return false; const id = String(track.id || ''); if (id.includes(';')) { try { const payload = atob(id.split(';')[1]); if (/\boriginal\b/i.test(payload)) return true; } catch (_) {  } } for (const value of Object.values(track)) { if (!value || typeof value.name !== 'string') continue; const name = value.name.toLocaleLowerCase(); if (originalLabels.some(label => name.includes(label))) return true; } return false; }; async function run() { if (busy) return; const player = findPlayer(); if (!player) return; busy = true; try { const response = await player.getPlayerResponse(); const videoId = response?.videoDetails?.videoId; if (!videoId || videoId === lastHandledVideoId) return; if (videoId !== waitingVideoId) { waitingVideoId = videoId; waitingSince = Date.now(); startPolling(); } const tracks = await player.getAvailableAudioTracks(); const selected = await player.getAudioTrack(); const original = Array.isArray(tracks) && selected ? tracks.find(isOriginal) : null; if (!original) { if (Date.now() - waitingSince >= giveUpAfterMs) markHandled(videoId); return; } if (selected.id !== original.id) { await player.setAudioTrack(original); agDebug('youtube-audio: switched to original track', videoId); } markHandled(videoId); } catch (_) { } finally { busy = false; } } const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; run(); }, 350); }; document.addEventListener('yt-navigate-finish', () => { lastHandledVideoId = null; waitingVideoId = null; startPolling(); schedule(); }); if (document.documentElement) { new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true }); } startPolling(); agDebug('youtube-audio: active'); schedule(); })(); }
  // social-originals.js
  if (ENABLE_OPTIONAL && on(["x.com", "twitter.com", "linkedin.com", "facebook.com", "instagram.com", "threads.net", "threads.com"])) { (() => { 'use strict'; if (window.__agSocialOriginalsInstalled) return; const onHost = (...domains) => domains.some(domain => location.hostname === domain || location.hostname.endsWith('.' + domain)); const site = onHost('x.com', 'twitter.com') ? { posts: 'article[data-testid="tweet"]', fallback: 'main' } : onHost('linkedin.com') ? { posts: '.feed-shared-update-v2, .occludable-update', fallback: 'main' } : onHost('facebook.com') ? { posts: '[role="article"]', fallback: '[role="main"]' } : onHost('instagram.com') ? { posts: 'article', fallback: 'main' } : onHost('threads.net', 'threads.com') ? { posts: '[data-pressable-container]', fallback: 'main' } : null; if (!site) return; window.__agSocialOriginalsInstalled = true; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const exact = new Set([ 'show original', 'see original', 'view original', 'show original text', 'ver original', 'ver el original', 'mostrar original', 'mostrar el original', 'mostrar o original', 'mostrar texto original', 'exibir original', 'ver texto original', "voir l'original", "afficher l'original", 'original anzeigen', 'original ansehen', 'mostra originale', 'visualizza originale', 'показать оригинал', '原文を表示', '显示原文', '顯示原文', '원문 보기', 'orijinali göster', 'pokaż oryginał', 'zobacz oryginał', 'toon origineel', 'origineel weergeven', 'visa original', 'vis original', 'näytä alkuperäinen', 'xem bản gốc', 'lihat asli', ]); const normalize = value => (value || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ').replace(/’/g, "'"); const near = el => { const rect = el.getBoundingClientRect(); return rect.bottom >= -400 && rect.top <= innerHeight + 1200; }; const navigates = el => el.tagName === 'A' && Boolean(el.getAttribute('href')) && el.getAttribute('href') !== '#'; const clicked = new WeakSet(); const run = () => { if (document.hidden) return; let scopes = document.querySelectorAll(site.posts); if (!scopes.length) scopes = document.querySelectorAll(site.fallback); let checked = 0; for (const scope of scopes) { if (!near(scope)) continue; for (const el of scope.querySelectorAll('button,[role="button"],a:not([href])')) { if (clicked.has(el) || !near(el)) continue; if (++checked > 700) return; if (!exact.has(normalize(el.textContent)) && !exact.has(normalize(el.getAttribute('aria-label')))) continue; if (navigates(el)) continue; clicked.add(el); el.click(); agDebug('social-originals: showed original'); } } }; let timer; const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; run(); }, 180); }; if (document.documentElement) new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true }); document.addEventListener('DOMContentLoaded', schedule, { once: true }); document.addEventListener('visibilitychange', schedule); addEventListener('scroll', schedule, { passive: true }); agDebug('social-originals: active'); schedule(); })(); }
  // youtube-details.js
  if (ENABLE_OPTIONAL && on(["www.youtube.com"])) { (() => { 'use strict'; if (location.hostname !== 'www.youtube.com' || window.__agOriginalDetailsInstalled) return; window.__agOriginalDetailsInstalled = true; const agDebug = (() => { let enabled = false; try { enabled = Boolean(localStorage.getItem('agOriginalLanguageDebug')); } catch (_) {  } return (...args) => { if (enabled) console.debug('[Original Language 0.3.0]', ...args); }; })(); const descriptionSelector = '#description-inline-expander yt-attributed-string'; const channelSelector = 'ytd-watch-metadata ytd-video-owner-renderer ytd-channel-name a'; const tokenPattern = /(https?:\/\/[^\s<>"']+)|(?:^|(?<=\s))((?:\d{1,2}:)?\d{1,2}:\d{2})(?=\s|$)/g; const fingerprint = text => text.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 40).toLocaleLowerCase(); const toSeconds = stamp => stamp.split(':').reduce((total, part) => total * 60 + Number(part), 0); const buildDescription = (text, player) => { const wrapper = document.createElement('span'); wrapper.style.whiteSpace = 'pre-wrap'; let position = 0; for (const match of text.matchAll(tokenPattern)) { wrapper.append(text.slice(position, match.index)); const link = document.createElement('a'); link.textContent = match[0]; if (match[1]) { link.href = match[1]; link.target = '_blank'; link.rel = 'noopener noreferrer'; } else { const seconds = toSeconds(match[2]); link.href = '#'; link.addEventListener('click', event => { event.preventDefault(); player.seekTo?.(seconds, true); }); } wrapper.append(link); position = match.index + match[0].length; } wrapper.append(text.slice(position)); return wrapper; }; const restore = async () => { if (document.hidden || location.pathname !== '/watch') return; const player = document.querySelector('#movie_player'); if (typeof player?.getPlayerResponse !== 'function') return; try { const details = (await player.getPlayerResponse())?.videoDetails; if (!details || details.videoId !== new URL(location.href).searchParams.get('v')) return; const description = details.shortDescription; if (typeof description === 'string' && fingerprint(description)) { for (const el of document.querySelectorAll(descriptionSelector)) { if (fingerprint(el.textContent || '') === fingerprint(description)) continue; el.replaceChildren(buildDescription(description, player)); agDebug('youtube-details: restored description', details.videoId); } } const channels = document.querySelectorAll(channelSelector); if (typeof details.author === 'string' && details.author && channels.length === 1 && channels[0].textContent.trim() !== details.author) { channels[0].textContent = details.author; agDebug('youtube-details: restored channel name', details.author); } } catch (_) {  } }; let timer; const schedule = () => { if (timer) return; timer = setTimeout(() => { timer = null; restore(); }, 400); }; document.addEventListener('yt-navigate-finish', schedule); document.addEventListener('visibilitychange', schedule); if (document.documentElement) { new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true }); } agDebug('youtube-details: active'); schedule(); })(); }
})();
