const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = require('node:path').join(__dirname, '..');
const read = f => fs.readFileSync(require('node:path').join(root, f), 'utf8');

async function testAudio() {
  let interval;
  let switches = 0;
  const original = { id: 'original', display: { name: 'English (Original)' } };
  const dubbed = { id: 'dubbed', display: { name: 'Português' } };
  let current = dubbed;
  const player = {
    getPlayerResponse: () => ({ videoDetails: { videoId: 'abcdefghijk' } }),
    getAvailableAudioTracks: () => [dubbed, original],
    getAudioTrack: () => current,
    setAudioTrack: t => { current = t; switches++; return true; },
  };
  const window = {};
  const context = { window, document: {
    querySelector: () => player, addEventListener: () => {}, documentElement: {},
  }, MutationObserver: class { observe() {} }, setTimeout: () => 1,
  setInterval: f => { interval = f; }, atob };
  vm.runInNewContext(read('youtube-audio.js'), context);
  await interval();
  assert.equal(current, original);
  current = dubbed; // Simulate manual choice: do not override it again.
  await interval();
  assert.equal(current, dubbed);
  assert.equal(switches, 1);
}

async function testTitles() {
  let scheduled;
  let fetches = 0;
  const titleEl = { textContent: 'Título traduzido', isConnected: true,
    matches: () => false };
  const document = {
    documentElement: {}, title: 'Título traduzido - YouTube',
    querySelectorAll: selector => selector.includes('#title h1') ? [titleEl] : [],
    addEventListener: () => {},
  };
  const location = { hostname: 'www.youtube.com',
    href: 'https://www.youtube.com/watch?v=abcdefghijk' };
  const window = {};
  const context = { document, location, window, innerHeight: 900, URL,
    setTimeout: f => { scheduled = f; return 1; },
    addEventListener: () => {}, MutationObserver: class { observe() {} },
    fetch: async () => { fetches++; return { ok: true, json: async () => ({title:'Original Title'}) }; },
  };
  vm.runInNewContext(read('youtube-titles.js'), context);
  scheduled();
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(titleEl.textContent, 'Original Title');
  assert.equal(document.title, 'Original Title - YouTube');
  assert.equal(fetches, 1);
}

async function main() {
  const compiled = read('original-language-adguard.txt').split('\n');
  assert.ok(compiled.includes('||reddit.com^$removeparam=tl'));
  const rules = compiled.filter(line => line.includes('#%#'));
  assert.equal(rules.length, 4);
  for (const rule of rules) new vm.Script(rule.split('#%#')[1]);
  await testAudio();
  await testTitles();
  console.log('PASS: Reddit rule, four JS rule syntax checks, audio selection, title restoration');
}
main().catch(err => { console.error(err); process.exitCode = 1; });
