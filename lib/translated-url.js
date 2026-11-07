/* Shared translated-URL handling, included by build.py.
   Recovers the original address from translate.google.com proxy links and from
   *.translate.goog hosts. The hostname decoding follows Google's published steps:
   https://developers.google.com/search/docs/appearance/ad-network-and-translation
   Anything that cannot be decoded with confidence returns null and is left alone. */
const gooSuffix = '.translate.goog';
const isTranslatorHost = host => host === 'translate.google.com' || host === 'translate.goog' || host.endsWith(gooSuffix);
const isSafeOriginal = url => ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) &&
  !url.username && !url.password && !isTranslatorHost(url.hostname);

const decodeGooHost = url => {
  let prefix = url.hostname.slice(0, -gooSuffix.length);
  const encodings = (url.searchParams.get('_x_tr_enc') || '').split(',');
  prefix = (url.searchParams.get('_x_tr_hp') || '') + prefix;
  if (encodings.includes('1') && prefix.startsWith('1-')) prefix = prefix.slice(2);
  const isIdn = encodings.includes('0') && prefix.startsWith('0-');
  if (isIdn) prefix = prefix.slice(2);
  const host = (isIdn ? 'xn--' : '') + prefix.replace(/\b-\b/g, '.').replace(/--/g, '-');
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : null;
};

const getOriginalUrl = href => {
  try {
    const url = new URL(href, location.href);
    if (url.hostname === 'translate.google.com') {
      if (!['/translate', '/website'].includes(url.pathname)) return null;
      const target = url.searchParams.get('u');
      if (!target) return null;
      const original = new URL(target);
      return isSafeOriginal(original) ? original.href : null;
    }
    if (!url.hostname.endsWith(gooSuffix)) return null;
    const host = decodeGooHost(url);
    if (!host) return null;
    const scheme = url.searchParams.get('_x_tr_sch') === 'http' ? 'http:' : 'https:';
    // Filter the raw query so the site's own parameters keep their exact encoding.
    const query = url.search.slice(1).split('&').filter(part => part && !part.startsWith('_x_tr_')).join('&');
    const original = new URL(scheme + '//' + host + url.pathname + (query ? '?' + query : '') + url.hash);
    return isSafeOriginal(original) ? original.href : null;
  } catch (_) { return null; }
};
