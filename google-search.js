/* Google Search original-language restoration.
   Based on the independently MIT-licensed research implementation by EstebanAlpha:
   https://greasyfork.org/en/scripts/570066-google-search-no-auto-translate
   Site DOM selectors are volatile: this implementation changes only result groups
   where a translated and original block coexist. */
(() => {
  'use strict';
  if (window.__agOriginalGoogleSearchInstalled) return;
  if (location.pathname !== '/search' && !(location.pathname === '/' && new URL(location.href).searchParams.has('q'))) return;
  window.__agOriginalGoogleSearchInstalled = true;

  const translatedHosts = new Set(['translate.google.com']);
  const translatedBlocks = new WeakSet();
  const getOriginalUrl = href => {
    try {
      const url = new URL(href, location.href);
      if (!translatedHosts.has(url.hostname) || !['/translate', '/website'].includes(url.pathname)) return null;
      const target = url.searchParams.get('u');
      if (!target) return null;
      const original = new URL(target);
      if (!['http:', 'https:'].includes(original.protocol) || !original.hostname || original.username || original.password) return null;
      return original.href;
    } catch (_) { return null; }
  };

  const hide = el => {
    if (el.style.getPropertyValue('display') !== 'none' || el.style.getPropertyPriority('display') !== 'important') {
      el.style.setProperty('display', 'none', 'important');
    }
  };
  const show = el => {
    if (el.hidden) el.hidden = false;
    if (el.style.getPropertyValue('display') === 'none') el.style.removeProperty('display');
  };

  const restore = () => {
    const translatedContainers = new Set();
    const groupParents = new Set();
    for (const block of document.querySelectorAll('.uIV6Ge')) {
      if (block.parentElement) groupParents.add(block.parentElement);
    }

    for (const parent of groupParents) {
      const blocks = Array.from(parent.children).filter(el => el.classList?.contains('uIV6Ge'));
      if (blocks.length < 2) continue;
      const translated = blocks.find(block => translatedBlocks.has(block) || Array.from(block.querySelectorAll('a[href]')).some(a => getOriginalUrl(a.href)));
      const original = blocks.find(block => block !== translated && block.querySelector('a[href]'));
      if (!translated || !original) continue;
      translatedBlocks.add(translated);
      hide(translated);
      show(original);
      const container = parent.closest('.MjjYud, [data-dsrp]');
      if (container) translatedContainers.add(container);
    }

    for (const container of translatedContainers) {
      for (const wrapper of container.querySelectorAll('.VwiC3b')) {
        const snippets = Array.from(wrapper.querySelectorAll('.Pa9Ggf'));
        if (snippets.length < 2) continue;
        const laterHidden = snippets.slice(1).some(el => el.hidden || el.style.getPropertyValue('display') === 'none');
        if (!laterHidden) continue;
        hide(snippets[0]);
        snippets.slice(1).forEach(show);
      }
      for (const bar of container.querySelectorAll('.nlNnsd')) hide(bar);
    }

    // Link-only fallback when the original title/snippet is not in the page.
    // This does NOT falsely claim to have restored the original text.
    for (const a of document.querySelectorAll('a[href*="translate.google.com/translate"],a[href*="translate.google.com/website"]')) {
      const original = getOriginalUrl(a.href);
      if (original && a.href !== original) a.href = original;
    }
  };

  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; restore(); }, 120);
  };
  const observe = () => {
    const root = document.querySelector('#search') || document.body || document.documentElement;
    if (!root) return;
    new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'childList' && m.addedNodes.length > 0 ||
        m.type === 'attributes' && m.attributeName === 'style' &&
        (m.target.classList?.contains('uIV6Ge') || m.target.classList?.contains('Pa9Ggf')))) schedule();
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { restore(); observe(); }, { once: true });
  } else {
    restore();
    observe();
  }
  window.addEventListener('pageshow', schedule);
})();
