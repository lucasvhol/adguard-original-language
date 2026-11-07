const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = filename => fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');

class Style {
  constructor(display = '') { this.display = display; this.priority = ''; }
  getPropertyValue(key) { return key === 'display' ? this.display : ''; }
  getPropertyPriority(key) { return key === 'display' ? this.priority : ''; }
  setProperty(key, value, priority = '') { if (key === 'display') { this.display = value; this.priority = priority; } }
  removeProperty(key) { if (key === 'display') { this.display = ''; this.priority = ''; } }
}
class Elem {
  constructor(kind, attrs = {}) {
    this.kind = kind;
    this.style = new Style(attrs.display || '');
    this.hidden = Boolean(attrs.hidden);
    this.href = attrs.href || '';
    this.children = [];
    this.parentElement = null;
    this.classList = { contains: k => k === kind };
  }
  add(child) { child.parentElement = this; this.children.push(child); return child; }
  querySelectorAll(selector) {
    const all = [];
    const collect = node => {
      for (const child of node.children) { all.push(child); collect(child); }
    };
    collect(this);
    if (selector === '.uIV6Ge' || selector === '.VwiC3b' || selector === '.Pa9Ggf' || selector === '.nlNnsd')
      return all.filter(el => el.kind === selector.slice(1));
    if (selector === 'a[href]') return all.filter(el => el.kind === 'a[href]');
    if (selector.includes('a[href*=')) return all.filter(el => el.kind === 'a[href]' && el.href.includes('translate.google.com/'));
    return [];
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) {
    let current = this;
    while (current) { if (selector.includes('.MjjYud') && current.kind === 'MjjYud') return current; current = current.parentElement; }
    return null;
  }
}

function fakeSearch({ originalExists }) {
  const result = new Elem('MjjYud');
  const parent = result.add(new Elem('parent'));
  const translatedBlock = parent.add(new Elem('uIV6Ge'));
  const translatedAnchor = translatedBlock.add(new Elem('a[href]', { href: 'https://translate.google.com/translate?u=https%3A%2F%2Fexample.net%2Fsource%3Fid%3D9&hl=pt' }));
  const originalBlock = originalExists ? parent.add(new Elem('uIV6Ge', { display: 'none' })) : null;
  if (originalBlock) originalBlock.add(new Elem('a[href]', { href: 'https://example.net/source?id=9' }));
  const wrapper = result.add(new Elem('VwiC3b'));
  const translatedSnippet = wrapper.add(new Elem('Pa9Ggf'));
  const originalSnippet = wrapper.add(new Elem('Pa9Ggf', { display: 'none' }));
  const bar = result.add(new Elem('nlNnsd'));
  const doc = { readyState: 'complete', documentElement: {}, body: result,
    querySelector: s => s === '#search' ? result : null,
    querySelectorAll: s => result.querySelectorAll(s), addEventListener() {} };
  const loc = { hostname: 'www.google.com.br', pathname: '/search', href: 'https://www.google.com.br/search?q=demo' };
  const window = { addEventListener() {} };
  const context = { document: doc, location: loc, URL, window, setTimeout() {}, MutationObserver: class { observe() {} } };
  vm.runInNewContext(read('google-search.js'), context);
  return { translatedBlock, translatedAnchor, originalBlock, translatedSnippet, originalSnippet, bar };
}

function testSearch() {
  const yes = fakeSearch({ originalExists: true });
  assert.equal(yes.translatedBlock.style.display, 'none');
  assert.equal(yes.originalBlock.style.display, '');
  assert.equal(yes.translatedSnippet.style.display, 'none');
  assert.equal(yes.originalSnippet.style.display, '');
  assert.equal(yes.bar.style.display, 'none');
  assert.equal(yes.translatedAnchor.href, 'https://example.net/source?id=9');
  const no = fakeSearch({ originalExists: false });
  assert.equal(no.translatedBlock.style.display, '');
  assert.equal(no.bar.style.display, '');
  assert.equal(no.translatedAnchor.href, 'https://example.net/source?id=9');
}

function testProxy() {
  for (const [href, expected] of [
    ['https://translate.google.com/translate?hl=pt&u=https%3A%2F%2Fexample.com%2Fthing', 'https://example.com/thing'],
    ['https://translate.google.com/website?u=https%3A%2F%2Fexample.org%2Fa', 'https://example.org/a'],
    ['https://translate.google.com/?sl=auto&tl=en&text=hi', null],
    ['https://translate.google.com/translate?u=javascript%3Aalert(1)', null],
    ['https://translate.google.com/translate?u=https%3A%2F%2Fname%3Apass%40example.com', null],
  ]) {
    let redirected = null;
    const url = new URL(href);
    const location = { hostname: url.hostname, pathname: url.pathname, href, replace: val => { redirected = val; } };
    vm.runInNewContext(read('google-proxy.js'), { location, URL });
    assert.equal(redirected, expected, `Redirect failed for ${href}`);
  }
}

function testOptionalSocial() {
  let clicked = 0;
  const button = { textContent: 'Show original', tagName: 'BUTTON', getAttribute: () => null, click: () => { clicked++; } };
  const article = { querySelectorAll: () => [button] };
  const document = { documentElement: {}, addEventListener() {}, querySelectorAll: () => [article] };
  let scheduled;
  const context = { document, location: { hostname: 'x.com', origin: 'https://x.com' }, window: {},
    MutationObserver: class { observe() {} }, setTimeout: fn => { scheduled = fn; return 1; } };
  vm.runInNewContext(read('social-originals.js'), context);
  scheduled();
  assert.equal(clicked, 1);
  scheduled();
  assert.equal(clicked, 1, 'Should never repeatedly click the same element');
}

function main() {
  const compiled = read('original-language-adguard.txt');
  const rules = compiled.split('\n').filter(line => line.includes('#%#'));
  assert.equal(rules.length, 4);
  assert.ok(compiled.includes('||reddit.com^$removeparam=tl'));
  assert.ok(compiled.includes('www.google.com.br'));
  assert.ok(!compiled.includes('$urlskip='), 'uBlock-only rule must not be included');
  for (const rule of rules) new vm.Script(rule.split('#%#')[1]);
  const optional = read('optional-social-originals.txt').split('\n').filter(l => l.includes('#%#'));
  assert.equal(optional.length, 1);
  new vm.Script(optional[0].split('#%#')[1]);
  testSearch(); testProxy(); testOptionalSocial();
  console.log('PASS: 5 compiled JS rules, Google original result restoration, safe proxy bypass, optional X auto-original, Reddit parameter');
}
main();
