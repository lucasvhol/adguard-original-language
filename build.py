"""Build trusted AdGuard filter lists from the reviewed JavaScript sources."""
from pathlib import Path
import re

ROOT = Path(__file__).parent
VERSION = '0.2.1'
GOOGLE_DOMAINS = ','.join([
    'www.google.com', 'www.google.com.br', 'www.google.co.uk',
    'www.google.de', 'www.google.fr', 'www.google.es', 'www.google.pt',
    'www.google.it', 'www.google.ca', 'www.google.com.au',
    'www.google.co.jp', 'www.google.com.mx', 'www.google.co.in',
    'www.google.nl', 'www.google.pl', 'www.google.com.ar',
])


def compile_rule(domains: str, filename: str) -> str:
    source = (ROOT / filename).read_text(encoding='utf-8')
    source = re.sub(r'/\*.*?\*/', '', source, flags=re.S)
    code = ' '.join(
        re.sub(r'\s+//.*$', '', line).strip()
        for line in source.splitlines()
        if not line.lstrip().startswith('//') and line.strip()
    )
    return f'{domains}#%#{code}'


def build(filename: str, header: list[str], rules: list[str]) -> None:
    target = ROOT / filename
    target.write_text('\n'.join(header + rules) + '\n', encoding='utf-8')
    print(f'{target.name}: {target.stat().st_size:,} bytes')


build('original-language-adguard.txt', [
    '! Title: Original Language — Google, Reddit & YouTube',
    '! Description: Prefer original Google results, bypass translated page links, strip Reddit tl, restore YouTube titles/audio (best effort).',
    f'! Version: {VERSION}',
    '! Expires: 7 days',
    '! Homepage: https://github.com/lucasvhol/adguard-original-language',
    '! Subscription: https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/original-language-adguard.txt',
    '! Source: https://greasyfork.org/en/scripts/570066-google-search-no-auto-translate (MIT, adapted)',
    '! Source: https://github.com/zpix1/yt-anti-translate (MIT core, adapted)',
    '! Requires a TRUSTED AdGuard custom filter and browser User Scripts permission for JavaScript rules.',
    '! All JS features are experimental and website-dependent. Reddit URL cleanup is stable.',
    '!',
    '! Reddit — strip translated language parameter.',
    '||reddit.com^$removeparam=tl',
    '!',
    '! Google Search — reveal original title/snippet blocks where present; fix translated result links.',
    compile_rule(GOOGLE_DOMAINS, 'google-search.js'),
    '!',
    '! Google Translate — bypass full-page proxy; leave translation editor untouched.',
    compile_rule('translate.google.com', 'google-proxy.js'),
    '!',
    '! YouTube — original title and audio, experimental.',
    compile_rule('www.youtube.com', 'youtube-titles.js'),
    compile_rule('youtube.com,youtube-nocookie.com', 'youtube-audio.js'),
], [])

build('optional-social-originals.txt', [
    '! Title: Original Language — OPTIONAL X & LinkedIn (Experimental)',
    '! Description: Best-effort click of explicitly labeled original-language buttons; NOT enabled in the main filter.',
    f'! Version: {VERSION}',
    '! Homepage: https://github.com/lucasvhol/adguard-original-language',
    '! Subscription: https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/optional-social-originals.txt',
    '! Requires trusted JS rules. Test before keeping this filter enabled.',
    compile_rule('x.com,twitter.com,www.linkedin.com', 'social-originals.js'),
], [])
