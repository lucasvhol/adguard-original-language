"""Build the AdGuard filter lists and the userscript from the reviewed JavaScript sources.

    python build.py           write the generated files
    python build.py --check   fail if the generated files are out of date
"""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).parent
VERSION = '0.3.0'
REPO = 'https://github.com/lucasvhol/adguard-original-language'
RAW = 'https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main'

# From https://www.google.com/supported_domains. Listed explicitly because AdGuard
# does not support TLD wildcards (www.google.*) in every MV3 context.
GOOGLE_TLDS = '''
ad ae al am as at az ba be bf bg bi bj bs bt by ca cat cd cf cg ch ci cl cm cn
co.ao co.bw co.ck co.cr co.id co.il co.in co.jp co.ke co.kr co.ls co.ma co.mz
co.nz co.th co.tz co.ug co.uk co.uz co.ve co.vi co.za co.zm co.zw com com.af
com.ag com.ar com.au com.bd com.bh com.bn com.bo com.br com.bz com.co com.cu
com.cy com.do com.ec com.eg com.et com.fj com.gh com.gi com.gt com.hk com.jm
com.kh com.kw com.lb com.ly com.mm com.mt com.mx com.my com.na com.ng com.ni
com.np com.om com.pa com.pe com.pg com.ph com.pk com.pr com.py com.qa com.sa
com.sb com.sg com.sl com.sv com.tj com.tr com.tw com.ua com.uy com.vc com.vn
cv cz de dj dk dm dz ee es fi fm fr ga ge gg gl gm gr gy hn hr ht hu ie im iq
is it je jo kg ki kz la li lk lt lu lv md me mg mk ml mn mu mv mw ne nl no nr
nu pl pn ps pt ro rs ru rw sc se sh si sk sm sn so sr st td tg tl tm tn to tt
vu ws
'''.split()
GOOGLE_DOMAINS = [f'www.google.{tld}' for tld in GOOGLE_TLDS]

REDDIT = ['reddit.com']
PROXIES = ['translate.google.com', 'translate.goog']
YOUTUBE_WWW = ['www.youtube.com']
YOUTUBE_ALL = ['youtube.com', 'youtube-nocookie.com']
SOCIAL = ['x.com', 'twitter.com', 'linkedin.com', 'facebook.com',
          'instagram.com', 'threads.net', 'threads.com']


def expand(source: str) -> str:
    """Replace /* @include path */ markers with that file's contents."""
    return re.sub(r'/\*\s*@include\s+(\S+)\s*\*/',
                  lambda match: (ROOT / match.group(1)).read_text(encoding='utf-8'),
                  source)


def compile_code(filename: str) -> str:
    """Return a source file as one line, which is what a filter rule requires."""
    source = expand((ROOT / filename).read_text(encoding='utf-8'))
    source = re.sub(r'/\*.*?\*/', '', source, flags=re.S)
    code = ' '.join(
        re.sub(r'\s+//.*$', '', line).strip()
        for line in source.splitlines()
        if not line.lstrip().startswith('//') and line.strip()
    )
    return code.replace('__VERSION__', VERSION)


def rule(domains: list[str], filename: str) -> str:
    return f"{','.join(domains)}#%#{compile_code(filename)}"


def match_patterns(domains: list[str]) -> list[str]:
    """www. hosts match exactly; other domains also cover their subdomains."""
    return [f'*://{d}/*' if d.startswith('www.') else f'*://*.{d}/*' for d in domains]


def main_filter() -> str:
    return '\n'.join([
        '! Title: Original Language — Google, Reddit & YouTube',
        '! Description: Prefer original Google results, bypass translated pages, strip Reddit tl, restore YouTube titles/audio (best effort).',
        f'! Version: {VERSION}',
        '! Expires: 3 days',
        f'! Homepage: {REPO}',
        f'! Subscription: {RAW}/original-language-adguard.txt',
        '! Source: https://greasyfork.org/en/scripts/570066-google-search-no-auto-translate (MIT, adapted)',
        '! Source: https://github.com/zpix1/yt-anti-translate (MIT core, adapted)',
        '! Requires a TRUSTED AdGuard custom filter and browser User Scripts permission for JavaScript rules.',
        '! All JS features are experimental and website-dependent. Reddit URL cleanup is stable.',
        '!',
        '! Reddit — strip translated language parameter from requests and in-site navigation.',
        '||reddit.com^$removeparam=tl',
        rule(REDDIT, 'reddit-links.js'),
        '!',
        '! Google Search — reveal original title/snippet blocks where present; fix translated result links.',
        rule(GOOGLE_DOMAINS, 'google-search.js'),
        '!',
        '! Google Translate — bypass full-page proxies unless #keep-translation is present; leave the translation editor untouched.',
        rule(PROXIES, 'google-proxy.js'),
        '!',
        '! YouTube — original title and audio, experimental.',
        rule(YOUTUBE_WWW, 'youtube-titles.js'),
        rule(YOUTUBE_ALL, 'youtube-audio.js'),
    ]) + '\n'


def optional_filter() -> str:
    return '\n'.join([
        '! Title: Original Language — OPTIONAL Social & YouTube Details (Experimental)',
        '! Description: Best-effort click of labeled original-language buttons on social sites, and YouTube description/channel name restoration. NOT enabled in the main filter.',
        f'! Version: {VERSION}',
        '! Expires: 3 days',
        f'! Homepage: {REPO}',
        f'! Subscription: {RAW}/optional-social-originals.txt',
        '! Requires trusted JS rules. Test before keeping this filter enabled.',
        rule(SOCIAL, 'social-originals.js'),
        rule(YOUTUBE_WWW, 'youtube-details.js'),
    ]) + '\n'


def userscript() -> str:
    modules = [
        (REDDIT, 'reddit-links.js', False),
        (GOOGLE_DOMAINS, 'google-search.js', False),
        (PROXIES, 'google-proxy.js', False),
        (YOUTUBE_WWW, 'youtube-titles.js', False),
        (YOUTUBE_ALL, 'youtube-audio.js', False),
        (SOCIAL, 'social-originals.js', True),
        (YOUTUBE_WWW, 'youtube-details.js', True),
    ]
    domains = list(dict.fromkeys(d for module in modules for d in module[0]))
    lines = [
        '// ==UserScript==',
        '// @name         Original Language',
        '// @namespace    https://github.com/lucasvhol/adguard-original-language',
        f'// @version      {VERSION}',
        '// @description  Stop unwanted automatic translation on Google, YouTube, Reddit and social sites.',
        f'// @homepageURL  {REPO}',
        f'// @updateURL    {RAW}/original-language.user.js',
        f'// @downloadURL  {RAW}/original-language.user.js',
        '// @license      MIT',
        '// @run-at       document-start',
        '// @grant        none',
        *[f'// @match        {pattern}' for pattern in match_patterns(domains)],
        '// ==/UserScript==',
        '',
        '// Generated by build.py. Edit the source files, not this file.',
        '(() => {',
        "  'use strict';",
        '  // Set to true for the experimental social and YouTube description features.',
        '  const ENABLE_OPTIONAL = false;',
        '  const on = domains => domains.some(domain => location.hostname === domain || location.hostname.endsWith(`.${domain}`));',
    ]
    for module_domains, filename, optional in modules:
        condition = f'on({json.dumps(module_domains)})'
        if optional:
            condition = f'ENABLE_OPTIONAL && {condition}'
        lines.append(f'  // {filename}')
        lines.append(f'  if ({condition}) {{ {compile_code(filename)} }}')
    lines.append('})();')
    return '\n'.join(lines) + '\n'


def main() -> int:
    outputs = {
        'original-language-adguard.txt': main_filter(),
        'optional-social-originals.txt': optional_filter(),
        'original-language.user.js': userscript(),
    }
    check = '--check' in sys.argv[1:]
    stale = []
    for filename, content in outputs.items():
        target = ROOT / filename
        # Bytes, not text mode: Windows would otherwise write CRLF line endings.
        data = content.encode('utf-8')
        if check:
            if not target.exists() or target.read_bytes() != data:
                stale.append(filename)
        else:
            target.write_bytes(data)
            print(f'{filename}: {len(data):,} bytes')
    if stale:
        print('Out of date, run python build.py: ' + ', '.join(stale), file=sys.stderr)
        return 1
    if check:
        print('Generated files are up to date.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
