// Behaviour tests for the compiled rules, using a real DOM from jsdom.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const { read, code } = require('./helpers.cjs');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const page = (html, url) => new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
const place = (el, top) => { el.getBoundingClientRect = () => ({ top, bottom: top + 20 }); };

// Runs the redirect rule against a URL and reports where it navigated.
function proxyRedirect(href, storage) {
  let redirected = null;
  const url = new URL(href);
  const location = { hostname: url.hostname, pathname: url.pathname, href, replace: value => { redirected = value; } };
  vm.runInNewContext(code.proxy(), { location, URL, ...(storage ? { sessionStorage: storage } : {}) });
  return redirected;
}

function testGooDecoding() {
  for (const [href, expected] of [
    // Hyphen rules from Google's published decoding steps.
    ['https://foo-example-com.translate.goog/', 'https://foo.example.com/'],
    ['https://foo--example-com.translate.goog/', 'https://foo-example.com/'],
    ['https://www-example-co-uk.translate.goog/a/b?x=1&_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt-BR&_x_tr_pto=wapp#top', 'https://www.example.co.uk/a/b?x=1#top'],
    ['https://example-com.translate.goog/?q=a%20b&_x_tr_sl=en', 'https://example.com/?q=a%20b'],
    ['https://example-com.translate.goog/?_x_tr_sch=http&_x_tr_sl=en', 'http://example.com/'],
    ['https://0-mnchen--3ya-de.translate.goog/?_x_tr_enc=0', 'https://xn--mnchen-3ya.de/'],
    ['https://1-example-com.translate.goog/?_x_tr_enc=1', 'https://example.com/'],
    ['https://example-com.translate.goog/?_x_tr_hp=www-', 'https://www.example.com/'],
    // Cannot be decoded with confidence, so the page is left alone.
    ['https://nodots.translate.goog/', null],
    ['https://0-example-com.translate.goog/?_x_tr_enc=0', null], // Invalid punycode.
    ['https://translate-goog.translate.goog/', null],
  ]) assert.equal(proxyRedirect(href), expected, href);
}

function testKeepTranslation() {
  const translated = 'https://example-com.translate.goog/?_x_tr_sl=en';
  assert.equal(proxyRedirect(`${translated}#keep-translation`), null);
  assert.equal(proxyRedirect('https://translate.google.com/translate?u=https%3A%2F%2Fexample.com#keep-translation'), null);
  const values = new Map();
  const storage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  assert.equal(proxyRedirect(`${translated}#keep-translation`, storage), null);
  assert.equal(proxyRedirect('https://example-com.translate.goog/next?_x_tr_sl=en', storage), null, 'Choice lasts for the tab');
}

async function testSearchGoo() {
  const dom = page(`<div class="MjjYud"><div id="p">
    <div class="uIV6Ge"><a id="t" href="https://example-com.translate.goog/a?_x_tr_sl=en">traduzido</a></div>
    <div class="uIV6Ge" style="display:none"><a href="https://example.com/a">original</a></div>
  </div></div><a id="lone" href="https://other-org.translate.goog/?_x_tr_sl=en">solo</a>`, 'https://www.google.de/search?q=demo');
  dom.window.eval(code.search());
  await sleep(50); // jsdom fires DOMContentLoaded after construction.
  const { document } = dom.window;
  const [translated, original] = document.querySelectorAll('.uIV6Ge');
  assert.equal(translated.style.display, 'none');
  assert.equal(original.style.display, '');
  assert.equal(document.querySelector('#lone').href, 'https://other.org/');

  // Results appended outside #search, as "more results" can do, are still handled.
  const late = document.createElement('div');
  late.innerHTML = '<a id="late" href="https://late-org.translate.goog/?_x_tr_sl=en">x</a>';
  document.body.append(late);
  await sleep(250);
  assert.equal(document.querySelector('#late').href, 'https://late.org/');
}

function titlesPage(count, url = 'https://www.youtube.com/') {
  const rows = Array.from({ length: count }, (_, i) => {
    const id = `vid${String(i).padStart(8, '0')}`;
    return `<ytd-video-renderer><a id="video-title" href="/watch?v=${id}">traduzido ${i}</a></ytd-video-renderer>`;
  });
  return page(rows.join(''), url);
}
const oembed = requests => async url => {
  const id = decodeURIComponent(url).match(/v=([\w-]{11})/)[1];
  requests.push(id);
  return { ok: true, status: 200, json: async () => ({ title: `Original ${id}` }) };
};

async function testLongFeed() {
  const dom = titlesPage(200);
  const requests = [];
  const links = [...dom.window.document.querySelectorAll('a#video-title')];
  links.forEach((link, i) => place(link, i < 190 ? -5000 : 100)); // Scrolled past 190 rows.
  dom.window.fetch = oembed(requests);
  dom.window.eval(code.titles());
  await sleep(500);
  assert.equal(links[195].textContent, 'Original vid00000195', 'Titles after row 160 must be restored');
  assert.equal(requests.length, 10, 'Only rows near the viewport are fetched');
  const before = requests.length;
  dom.window.document.body.append(dom.window.document.createElement('div'));
  await sleep(350);
  assert.equal(requests.length, before, 'Repeated scans must not refetch');
}

async function testFetchRetry() {
  const dom = titlesPage(1);
  const link = dom.window.document.querySelector('a#video-title');
  place(link, 100);
  let calls = 0;
  const realNow = dom.window.Date.now;
  let offset = 0;
  dom.window.Date.now = () => realNow() + offset;
  dom.window.fetch = async () => {
    calls++;
    if (calls === 1) return { ok: false, status: 429 };
    return { ok: true, status: 200, json: async () => ({ title: 'Recovered' }) };
  };
  dom.window.eval(code.titles());
  await sleep(300);
  assert.equal(calls, 1);
  dom.window.document.body.append(dom.window.document.createElement('div'));
  await sleep(300);
  assert.equal(calls, 1, 'Backoff must hold back the retry');
  offset = 60000;
  dom.window.document.body.append(dom.window.document.createElement('div'));
  await sleep(600);
  assert.equal(calls, 2);
  assert.equal(link.textContent, 'Recovered', 'A temporary failure must not be permanent');
}

async function testTitleStructurePreserved() {
  const dom = page(`<ytd-rich-grid-media>
    <a id="video-title-link" href="/watch?v=abcdefghijk">
      <yt-formatted-string><span class="yt-core-attributed-string">
        <span role="text" id="nested-title">Título traduzido</span>
      </span></yt-formatted-string><span id="badge">BADGE</span>
    </a>
  </ytd-rich-grid-media>
  <ytd-video-renderer><a id="video-title" href="/watch?v=zzzzzzzzzzz">
    <yt-formatted-string><span id="part1">Título</span><span id="part2"> traduzido</span></yt-formatted-string>
  </a></ytd-video-renderer>
  <div id="unrelated"></div>`, 'https://www.youtube.com/');
  const { document } = dom.window;
  const link = document.querySelector('#video-title-link');
  const nested = document.querySelector('#nested-title');
  const badge = document.querySelector('#badge');
  const complex = document.querySelector('ytd-video-renderer yt-formatted-string');
  const parts = Array.from(complex.children);
  place(link, 100);
  place(document.querySelector('ytd-video-renderer a'), 100);
  let clicks = 0;
  nested.addEventListener('click', () => clicks++);
  dom.window.fetch = oembed([]);
  dom.window.eval(code.titles());
  await sleep(450);
  assert.equal(nested.textContent, 'Original abcdefghijk');
  assert.equal(document.querySelector('#nested-title'), nested, 'Original element must survive');
  assert.equal(document.querySelector('#badge'), badge, 'Badge must survive');
  assert.equal(badge.textContent, 'BADGE');
  nested.click();
  assert.equal(clicks, 1, 'Existing event handlers must survive');
  assert.equal(complex.textContent.trim(), 'Título traduzido', 'Multi-span titles must be left intact');
  assert.equal(complex.children[0], parts[0]);
  assert.equal(complex.children[1], parts[1]);
}

async function testTitleRerenderAndReusedLink() {
  const dom = page(`<ytd-video-renderer>
    <a id="video-title" href="/watch?v=abcdefghijk">
      <yt-formatted-string><span id="leaf">Traduzido</span></yt-formatted-string>
    </a>
  </ytd-video-renderer>`, 'https://www.youtube.com/');
  const { document } = dom.window;
  const link = document.querySelector('a#video-title');
  const leaf = document.querySelector('#leaf');
  place(link, 100);
  const requests = [];
  dom.window.fetch = oembed(requests);
  dom.window.eval(code.titles());
  await sleep(450);
  assert.equal(leaf.textContent, 'Original abcdefghijk');
  link.href = '/watch?v=zzzzzzzzzzz'; // YouTube recycles feed components.
  leaf.firstChild.nodeValue = 'Outro título traduzido';
  await sleep(500);
  assert.equal(leaf.textContent, 'Original zzzzzzzzzzz');
  assert.deepEqual(requests, ['abcdefghijk', 'zzzzzzzzzzz']);
  assert.equal(document.querySelector('#leaf'), leaf);
}

async function testTitlesExtras() {
  const dom = page(`<div class="ytp-title"><a class="ytp-title-link" href="https://www.youtube.com/watch?v=abcdefghijk">traduzido</a></div>
    <a class="ytp-videowall-still" href="/watch?v=zzzzzzzzzzz"><span class="ytp-videowall-still-info-title">traduzido</span></a>`, 'https://www.youtube.com/watch?v=abcdefghijk');
  dom.window.document.title = '(3) traduzido - YouTube';
  dom.window.fetch = oembed([]);
  dom.window.eval(code.titles());
  await sleep(600);
  const { document } = dom.window;
  assert.equal(document.title, '(3) Original abcdefghijk - YouTube', 'Unread count prefix is kept');
  assert.equal(document.querySelector('.ytp-title-link').textContent, 'Original abcdefghijk');
  assert.equal(document.querySelector('.ytp-videowall-still-info-title').textContent, 'Original zzzzzzzzzzz');
}

async function audioRun({ tracks, selector = '#movie_player', pathname = '/watch', advance = 0 }) {
  let interval;
  let cleared = 0;
  let time = 1000;
  let reads = 0;
  const player = {
    getPlayerResponse: () => ({ videoDetails: { videoId: 'abcdefghijk' } }),
    getAvailableAudioTracks: () => { reads++; return tracks; },
    getAudioTrack: () => tracks[0],
    setAudioTrack: track => { player.chosen = track; },
  };
  const context = { window: {}, atob, location: { hostname: 'www.youtube.com', pathname },
    document: { querySelector: s => s === selector ? player : null, addEventListener() {}, documentElement: {} },
    Date: { now: () => time }, MutationObserver: class { observe() {} }, setTimeout: () => 1,
    setInterval: fn => { interval = fn; return 1; }, clearInterval: () => { cleared++; } };
  vm.runInNewContext(code.audio(), context);
  await interval();
  time += advance;
  await interval();
  return { player, cleared, reads, tick: interval };
}

async function testAudioShorts() {
  const dubbed = { id: 'd', display: { name: 'Português' } };
  const original = { id: 'o', display: { name: 'English (Original)' } };
  const { player, cleared } = await audioRun({ tracks: [dubbed, original], selector: '#shorts-player', pathname: '/shorts/abcdefghijk' });
  assert.equal(player.chosen, original, 'Shorts player must be handled');
  assert.equal(cleared, 1, 'Polling stops once resolved');
}

async function testAudioGivesUp() {
  const run = await audioRun({ tracks: [{ id: 'x', display: { name: 'English' } }], advance: 20000 });
  assert.equal(run.cleared, 1, 'Polling stops for a video with no original track');
  const reads = run.reads;
  await run.tick();
  assert.equal(run.reads, reads, 'No more work after giving up');
  const early = await audioRun({ tracks: [{ id: 'x', display: { name: 'English' } }], advance: 1000 });
  assert.equal(early.cleared, 0, 'Tracks that load late still get a chance');
}

function testAudioSkipsStudio() {
  const window = {};
  vm.runInNewContext(code.audio(), { window, location: { hostname: 'studio.youtube.com' } });
  assert.equal(window.__agOriginalAudioInstalled, undefined);
}

async function testDetails() {
  const dom = page(`<div id="movie_player"></div>
    <ytd-watch-metadata><ytd-video-owner-renderer><ytd-channel-name><a href="/@x">Canal traduzido</a></ytd-channel-name></ytd-video-owner-renderer></ytd-watch-metadata>
    <div id="description-inline-expander"><yt-attributed-string>Descrição traduzida</yt-attributed-string></div>`, 'https://www.youtube.com/watch?v=abcdefghijk');
  const { document } = dom.window;
  const player = document.querySelector('#movie_player');
  const seeks = [];
  player.seekTo = seconds => seeks.push(seconds);
  player.getPlayerResponse = () => ({ videoDetails: { videoId: 'abcdefghijk', author: 'Real Channel',
    shortDescription: 'Original text <b>bold</b>\nSee https://example.com/a at 1:05 now' } });
  dom.window.eval(code.details());
  await sleep(600);
  const description = document.querySelector('yt-attributed-string');
  assert.ok(description.textContent.startsWith('Original text <b>bold</b>'));
  assert.equal(description.querySelector('b'), null, 'Description text is never parsed as HTML');
  const [url, stamp] = description.querySelectorAll('a');
  assert.equal(url.href, 'https://example.com/a');
  assert.equal(url.rel, 'noopener noreferrer');
  stamp.click();
  assert.deepEqual(seeks, [65], 'Timestamps stay clickable');
  assert.equal(document.querySelector('ytd-channel-name a').textContent, 'Real Channel');

  // An untranslated description keeps YouTube's own links.
  const same = page(`<div id="movie_player"></div><div id="description-inline-expander"><yt-attributed-string><a href="/hashtag/x">Same text here</a></yt-attributed-string></div>`, 'https://www.youtube.com/watch?v=abcdefghijk');
  same.window.document.querySelector('#movie_player').getPlayerResponse = () => ({ videoDetails: { videoId: 'abcdefghijk', shortDescription: 'Same text here' } });
  same.window.eval(code.details());
  await sleep(600);
  assert.equal(same.window.document.querySelector('yt-attributed-string a').getAttribute('href'), '/hashtag/x');
}

async function testSocialLongFeed() {
  const posts = Array.from({ length: 1500 }, (_, i) => `<div class="feed-shared-update-v2"><button>Curtir ${i}</button><button class="o">${i === 1499 ? 'Ver original' : 'Comentar'}</button></div>`);
  const dom = page(`<main>${posts.join('')}</main>`, 'https://www.linkedin.com/feed/');
  const { document } = dom.window;
  const all = [...document.querySelectorAll('.feed-shared-update-v2')];
  all.forEach((post, i) => { place(post, i < 1490 ? -9000 : 100); post.querySelectorAll('button').forEach(b => place(b, i < 1490 ? -9000 : 100)); });
  let clicks = 0;
  all[1499].querySelector('.o').addEventListener('click', () => clicks++);
  dom.window.eval(code.social());
  await sleep(400);
  assert.equal(clicks, 1, 'Posts deep in a long feed must be reached');
}

async function testSocialNoNavigation() {
  const dom = page(`<article data-testid="tweet">
    <a id="link" role="button" href="/somewhere">Show original</a>
    <button id="ok">Mostrar O  Original</button>
    <button id="label" aria-label="Voir l’original">x</button>
    <button id="other">Show originality</button>
  </article>`, 'https://mobile.x.com/home');
  const { document } = dom.window;
  const clicks = [];
  for (const el of document.querySelectorAll('a,button')) el.addEventListener('click', event => { event.preventDefault(); clicks.push(el.id); });
  dom.window.eval(code.social());
  await sleep(400);
  assert.deepEqual(clicks.sort(), ['label', 'ok']);
}

function testRedditLanding() {
  let redirected = null;
  const location = { href: 'https://www.reddit.com/r/a/?tl=pt-br&x=1', replace: value => { redirected = value; } };
  vm.runInNewContext(code.reddit(), { window: {}, location, URL });
  assert.equal(redirected, 'https://www.reddit.com/r/a/?x=1');
}

function testRedditInSite() {
  const dom = page('<a id="l" href="/r/a/?tl=pt-br"><span id="inner">post</span></a>', 'https://www.reddit.com/');
  const { window } = dom;
  window.eval(code.reddit());
  const link = window.document.querySelector('#l');
  link.addEventListener('click', event => event.preventDefault());
  window.document.querySelector('#inner').click();
  assert.equal(link.href, 'https://www.reddit.com/r/a/');
  window.history.pushState({}, '', '/r/b/?tl=de&keep=1');
  assert.equal(window.location.href, 'https://www.reddit.com/r/b/?keep=1');
  window.history.pushState({}, '', '/r/c/');
  assert.equal(window.location.href, 'https://www.reddit.com/r/c/');
}

function testDebugIsOptIn() {
  const logs = [];
  const run = storage => {
    const window = {};
    vm.runInNewContext(code.proxy(), { console: { debug: (...args) => logs.push(args) }, URL, localStorage: storage, window,
      location: { hostname: 'translate.google.com', pathname: '/translate', href: 'https://translate.google.com/translate?u=https%3A%2F%2Fexample.com', replace() {} } });
  };
  run({ getItem: () => null });
  assert.equal(logs.length, 0, 'Silent by default');
  run({ getItem: () => '1' });
  assert.equal(logs.length, 1);
  assert.match(logs[0][0], /Original Language \d+\.\d+\.\d+/);
}

function userscriptRun(hostname, enableOptional = false) {
  let source = read('original-language.user.js');
  if (enableOptional) source = source.replace('const ENABLE_OPTIONAL = false', 'const ENABLE_OPTIONAL = true');
  const window = { addEventListener() {} };
  const url = `https://${hostname}/search?q=x`;
  vm.runInNewContext(source, { window, URL, location: { hostname, pathname: '/search', href: url, replace() {} },
    document: { readyState: 'complete', addEventListener() {}, querySelectorAll: () => [], querySelector: () => null },
    history: {}, addEventListener() {}, setTimeout() {}, setInterval() {}, clearInterval() {}, MutationObserver: class { observe() {} } });
  return Object.keys(window).filter(key => key.startsWith('__ag')).sort();
}

function testUserscript() {
  const source = read('original-language.user.js');
  assert.match(source, /@grant\s+none/);
  assert.match(source, /@match\s+\*:\/\/www\.google\.com\.br\/\*/);
  assert.match(source, /@match\s+\*:\/\/\*\.translate\.goog\/\*/);
  assert.ok(source.includes(`@version      ${read('original-language-adguard.txt').match(/! Version: (.+)/)[1]}`));
  assert.deepEqual(userscriptRun('www.google.de'), ['__agOriginalGoogleSearchInstalled']);
  assert.deepEqual(userscriptRun('www.reddit.com'), ['__agOriginalRedditInstalled']);
  assert.deepEqual(userscriptRun('example.com'), []);
  assert.deepEqual(userscriptRun('x.com'), [], 'Optional modules are off by default');
  assert.deepEqual(userscriptRun('x.com', true), ['__agSocialOriginalsInstalled']);
  assert.deepEqual(userscriptRun('www.youtube.com'), ['__agOriginalAudioInstalled', '__agOriginalTitlesInstalled']);
}

async function main() {
  testGooDecoding();
  testKeepTranslation();
  await testSearchGoo();
  await testLongFeed();
  await testFetchRetry();
  await testTitlesExtras();
  await testTitleStructurePreserved();
  await testTitleRerenderAndReusedLink();
  await testAudioShorts();
  await testAudioGivesUp();
  testAudioSkipsStudio();
  await testDetails();
  await testSocialLongFeed();
  await testSocialNoNavigation();
  testRedditLanding();
  testRedditInSite();
  testDebugIsOptIn();
  testUserscript();
  console.log('PASS: translate.goog, bypass, long feeds, retries, Shorts audio, details, social, Reddit, debug, userscript');
}
main().catch(err => { console.error(err); process.exitCode = 1; });
