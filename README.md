# Original Language — AdGuard custom filters (v0.2.1)

Research date: **2026-11-07**. A small, source-reviewed attempt to keep original-language content on major websites. This is **not** a universal anti-translation switch.

## Subscribe directly from AdGuard

Once this repository is published as `lucasvhol/adguard-original-language` with a public `main` branch, add these URLs in **AdGuard → Settings → Filters → Custom → Add custom filter**:

**Main filter (recommended):**

```text
https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/original-language-adguard.txt
```

**Optional X / LinkedIn filter (experimental):**

```text
https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/optional-social-originals.txt
```

The URLs are **future subscription addresses, not live until the repository is published**. AdGuard can periodically fetch updated versions from the same URLs after the repository is public. Mark the custom filter **Trusted** to permit JavaScript rules, and on Chrome 138+ enable **Allow user scripts** for AdGuard in extension settings.

## Downloads / structure

| File | What it is |
|---|---|
| `original-language-adguard.txt` | Main trusted filter: Google Search, Google Translate proxy, Reddit, YouTube |
| `optional-social-originals.txt` | Separate opt-in experimental filter: X and LinkedIn (not included in main filter) |
| `google-search.js` | Readable Google Search restoration JS |
| `google-proxy.js` | Readable Google Translate proxy bypass JS |
| `youtube-titles.js`, `youtube-audio.js` | Readable experimental YouTube JS from v0.1 |
| `social-originals.js` | Readable X / LinkedIn opt-in JS |
| `build.py` | Rebuild AdGuard rule files from readable source |
| `Publish-ToGitHub.ps1` | Creates the public repository and pushes this project through GitHub CLI |
| `.github/workflows/ci.yml` | Runs filter build consistency and Node test suites |
| `tests/*.cjs` | Node smoke and simulated functional tests (not live-browser tests) |

## Coverage and accuracy

| Site | Implementation | Expected reliability |
|---|---|---|
| **Reddit** | `||reddit.com^$removeparam=tl` strips URL translation flag. | High for `?tl=` URLs. Does not change a Reddit account-level translation preference or remove translated Google snippets. |
| **Google Search** | JS detects original and translated `.uIV6Ge` siblings; shows the original title; swaps original snippet when available; rewrites `translate.google.com/...?...u=` result links to the original website. | Experimental; depends on Google's markup/experiments and only works for the 16 explicitly listed Google domains. Safe fallback: fix destination link only. |
| **Google Translate proxy** | For `translate.google.com/translate?u=...` and `/website?u=...` with an HTTP(S) destination, navigates to the original site. | Conditional: only if injection executes early enough; intentionally overrides even a manually requested *full-page* translation, but does not touch the regular text translation editor. |
| **YouTube video titles** | Uses oEmbed for original metadata, with visible-item limits and a bounded queue. | Experimental: selectors, rate limits, restricted videos, and oEmbed can fail. Desktop only. |
| **YouTube original audio** | Selects the original track through exposed player methods once per video. | Experimental: requires YouTube to expose the player methods and an original track. |
| **X / Twitter** (optional) | Clicks `Show original` if matching supported locale labels exist inside tweet articles. | Experimental; dependent on button layout and locale. |
| **LinkedIn** (optional) | Clicks `See original` if matching supported locale labels exist in feed content. | Experimental; dependent on button layout and locale. |

## Install — AdGuard browser extension (Chrome/Edge)

1. On Chrome **138+**, open `chrome://extensions`, then **AdGuard AdBlocker → Details → Allow user scripts**. Older Chrome may require Developer mode instead. See [AdGuard instructions](https://adguard.com/kb/adguard-browser-extension/user-scripts-api/).
2. Use AdGuard's **User Rules** and paste the contents of `original-language-adguard.txt` **or** import it under **Filters → Custom** as a **Trusted** custom filter, if your AdGuard version supports that import method.
3. Save, reload Google Search, Reddit, and YouTube.
4. Optionally install `optional-social-originals.txt` in the same way **only if** you want the experimental X and LinkedIn automation.

Do **not** enable the same rules in both Custom Filters and User Rules. AdGuard DNS/Home and simple content blocker variants do not run these JavaScript rules. Support varies by AdGuard product and browser. JavaScript rules must be in a **trusted** source.

## What AdGuard cannot reliably do

- Stop **Chrome's built-in page translation**. Set `chrome://settings/languages` instead.
- Recover translated titles/snippets that Google does not include in page markup. Our fallback restores the destination *link* only.
- Guarantee disabling X, LinkedIn, Instagram or Facebook translations via network rules; content translation is usually part of site/app logic. Prefer account controls when available.
- Restore all YouTube descriptions, thumbnails, chapter markers, subtitles or mobile titles. YouTube Anti Translate is still the more feature-complete extension.
- Avoid **Google-indexed translated Reddit results** (which may be displayed before you visit Reddit). The `tl` rule fixes navigation, not search ranking. An optional `-inurl:?tl=` search modifier may exclude those results but can reduce useful results; deliberately not added by default.

### Preferred site-specific controls (not filter rules)

- **X:** On a translated post, click the gear by *Show original* and disable auto-translate for that language (2026 feature).
- **LinkedIn:** Settings → language preferences → **Which languages do you not want content on LinkedIn translated from?** Add languages you read.
- **Instagram/Facebook:** On translated Reels, three-dot menu → audio/language → **Don't translate**.
- **Reddit:** Turn off machine translations in its own translation UI; the URL filter removes `?tl=` from links.
- **Google Search:** Language and region settings can influence results, but do not reliably disable translated search snippets; this filter addresses them on the page.

## Tests and limitations

Run:

```powershell
python .\build.py
node .\tests\smoke.cjs
node .\tests\google.cjs
```

Both tests exercise syntax checks and mock execution (YouTube audio, YouTube title, Google result swapping, safe Google Translate proxy redirect, Reddit rule presence, and optional X click). They are **not tests against a logged-in, live browser**. Google, X, LinkedIn, and YouTube DOMs frequently change.

To remove all behavior, disable or delete the two imported filters (or remove the rules from User Rules).

## References and attribution

- [Google Search translated result documentation](https://developers.google.com/search/docs/appearance/translated-results)
- [Google Search — No Auto-Translate, EstebanAlpha (MIT)](https://greasyfork.org/en/scripts/570066-google-search-no-auto-translate/code). Original hidden-block concept adapted independently with narrower fallback/safety guards; credit for the core discovery.
- [No Google Search Translation, lnoss (GPL-3.0)](https://github.com/lnoss/no-google-search-translation). Research reference only, no copied source.
- [YouTube Anti Translate, zpix1 (MIT core)](https://github.com/zpix1/yt-anti-translate). Research reference for original metadata/player selection; excluded mobile-audio source not used.
- [redditUntranslate (GPL-3.0)](https://github.com/SeidSmatti/redditUntranslate). Research reference only; its `?tl=` functionality is recreated with AdGuard's single standard rule.
- [AdGuard filter syntax & restrictions](https://adguard.com/kb/general/ad-filtering/create-own-filters/)
- [AdGuard User Scripts API (Chrome 138+)](https://adguard.com/kb/adguard-browser-extension/user-scripts-api/)
- [Reddit translation help](https://support.reddithelp.com/hc/en-us/articles/27784816873236-Translations-for-feeds-posts-and-comments)
- [LinkedIn post translation opt-out](https://www.linkedin.com/help/linkedin/answer/a525292)
- [Meta translation controls](https://about.fb.com/news/2025/10/translate-dub-and-lip-sync-your-reels-between-hindi-and-english-now-on-instagram-and-facebook/)
- [X auto-translation controls](https://techcrunch.com/2026/04/08/x-is-rolling-out-automatic-translation-and-photo-editing-powered-by-grok/)

**Why no `$urlskip` rule?** Community answers recommend `||translate.google.com/translate$urlskip=?u`, but `$urlskip` is documented for uBlock Origin and is not established as supported in AdGuard. This project uses AdGuard `#%#` JavaScript rules instead.
