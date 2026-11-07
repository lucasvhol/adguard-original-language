# Original Language for AdGuard

**Stop unwanted automatic translations and experience websites in their original language.**

Original Language is a collection of custom AdGuard filters, plus a userscript for other blockers, designed to reduce automatic translation across popular websites, including Google Search, YouTube, Reddit, X (Twitter), LinkedIn, Facebook, Instagram, and Threads.

Whether you're tired of translated YouTube titles, AI-dubbed videos, or Google changing search results into another language, these filters help preserve the original content whenever possible.

No additional browser extension is needed beyond a compatible AdGuard installation.

## Features

| Website | What the filter does |
|---|---|
| **Google Search** | Restores original search result titles and descriptions when available, on all Google country domains. |
| **YouTube** | Attempts to restore original video titles (feeds, Shorts, player, end screen, miniplayer) and automatically select original audio tracks, including on Shorts. |
| **Reddit** | Removes translation parameters from Reddit links, including while browsing inside the site. |
| **Google Translate** | Redirects translated pages, including `*.translate.goog` addresses, to the original website. |
| **YouTube details** | Optionally restores video descriptions and channel names. |
| **X, LinkedIn, Facebook, Instagram, Threads** | Optionally clicks "Show original" on translated posts. |

**Note:** Website compatibility varies. Some features depend on how each website handles translations and may stop working after site updates.

## Installation

### Step 1 — Enable AdGuard

Install [AdGuard AdBlocker](https://adguard.com/) for your browser if you haven't already.

For Chrome 138 or newer, JavaScript filtering also requires:

1. Open `chrome://extensions`.
2. Find **AdGuard AdBlocker** and select **Details**.
3. Enable **Allow user scripts**.

For other browsers, refer to [AdGuard's user scripts documentation](https://adguard.com/kb/adguard-browser-extension/user-scripts-api/).

### Step 2 — Add the filter

**One-click:** [Subscribe to the main filter](https://subscribe.adblockplus.org/?location=https%3A%2F%2Fraw.githubusercontent.com%2Flucasvhol%2Fadguard-original-language%2Fmain%2Foriginal-language-adguard.txt&title=Original%20Language). AdGuard opens its add-filter dialog. **You still need to enable the Trusted option there**, or the JavaScript rules will not run.

**Manually:**

1. Open **AdGuard Settings**.
2. Navigate to **Filters → Custom filters**.
3. Select **Add custom filter**.
4. Paste the following subscription URL:

**Main filter — Recommended**

```text
https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/original-language-adguard.txt
```

5. Add the filter and enable the **Trusted** option to allow its JavaScript rules.
6. Save your changes and reload any affected websites.

That's it! AdGuard can now fetch updated filter versions from this repository.

### Step 3 — Optional experimental features

For "Show original" on X (Twitter), LinkedIn, Facebook, Instagram, and Threads, and for YouTube descriptions and channel names, you can install this experimental filter ([one-click](https://subscribe.adblockplus.org/?location=https%3A%2F%2Fraw.githubusercontent.com%2Flucasvhol%2Fadguard-original-language%2Fmain%2Foptional-social-originals.txt&title=Original%20Language%20Optional)):

```text
https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/optional-social-originals.txt
```

Follow the same installation steps above, including the **Trusted** option.

This filter is entirely optional and separate from the main filter because these interfaces change frequently. When a YouTube description is restored, its links and timestamps stay clickable, but hashtags and @mentions become plain text.

### Other ad blockers: userscript

The JavaScript rules only run in AdGuard. For uBlock Origin, Brave, or any other blocker, install a userscript manager such as [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/), then open:

```text
https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/original-language.user.js
```

The userscript contains the same features as the main filter and updates through your manager. To turn on the experimental features, change `ENABLE_OPTIONAL` to `true` near the top of the script (updates reset this). Do not use the userscript and the AdGuard filter together.

### Keeping a translated page

Translated pages redirect to the original site, even when you asked for the translation. To stay on one, add `#keep-translation` to the end of its address and press Enter. The choice lasts until you close that tab, so links within the translated site keep working.

## How it works

Original Language uses AdGuard's filtering capabilities to reduce unwanted translations through three methods:

- **URL cleanup:** Removes translation parameters from links, allowing websites to open their original versions.
- **Content restoration:** Retrieves original titles and descriptions when websites make the information available.
- **Original audio selection:** Attempts to switch YouTube videos from dubbed audio to their original tracks.

The filter does not translate content itself. Its purpose is to preserve the language originally used by the creator.

## Compatibility

| Platform | Support |
|---|---|
| AdGuard browser extension (Chrome / Edge) | Supported with JavaScript filtering enabled |
| Other AdGuard browser extensions | Depends on browser and JavaScript rule support |
| AdGuard for Windows / macOS | Depends on filtering configuration |
| AdGuard DNS / AdGuard Home | Not supported for JavaScript features |
| Mobile content blockers | Limited; JavaScript support varies |
| uBlock Origin, Brave, and other blockers | Filter lists are not supported; use the userscript |
| Tampermonkey / Violentmonkey | Supported through the userscript |

**Important:** This project is not a universal translation blocker. Some websites perform translations directly on their servers, making original content unavailable to standard content filters.

## Known limitations

- **YouTube:** Original titles and audio selection are experimental. Subtitles, thumbnails, chapters, and mobile-specific interfaces are not fully supported. Descriptions and channel names need the optional filter.
- **Google Search:** Original titles and snippets can only be restored when Google's page contains the necessary information.
- **Reddit:** The filter removes translation parameters from URLs but does not change Reddit account preferences.
- **Social sites:** Optional restoration relies on visible interface controls and may be affected by website updates. It only recognizes a set list of "Show original" labels.
- **Google Translate:** Translated pages redirect to the original site, including when translation was requested manually, unless you use [`#keep-translation`](#keeping-a-translated-page).
- **Browser translation:** Chrome's built-in translation feature must be configured separately through `chrome://settings/languages`.

For more complete YouTube translation controls, consider [YouTube Anti Translate](https://github.com/zpix1/yt-anti-translate).

## Troubleshooting

**The filter isn't working**

Check that AdGuard is enabled, that the custom filter is marked as Trusted, and that JavaScript filtering is permitted by your browser. Reload the affected website afterward.

**YouTube is still translating some content**

YouTube frequently changes its interface. Some translation features may require the dedicated YouTube Anti Translate extension.

**A website behaves unexpectedly**

Temporarily disable the Original Language filter and reload the page. If the issue disappears, the filter may be interfering with the website.

**How do I see what the filter is doing?**

Open the site, press F12, open **Console**, and run:

```js
localStorage.setItem('agOriginalLanguageDebug', '1')
```

Reload the page and enable the **Verbose** log level. Lines starting with `[Original Language]` show the version, active features, and what was restored. Please include them when reporting a problem. Run `localStorage.removeItem('agOriginalLanguageDebug')` to turn this off.

**How do I uninstall it?**

Open **AdGuard → Settings → Filters → Custom filters** and remove or disable the Original Language subscriptions.

## Updates

The filters are hosted directly on GitHub, making them easy to maintain and update.

Once subscribed, AdGuard can periodically check for new versions without requiring you to download the filter again.

Updates may include improvements to existing websites, support for additional platforms, compatibility fixes, and performance optimizations.

For issues or feature suggestions, visit the [GitHub repository](https://github.com/lucasvhol/adguard-original-language) and open an issue.

## For developers

The repository includes readable JavaScript source files, a Python build script, and automated tests.

To rebuild the generated files and run the test suites:

```powershell
python .\build.py
npm install
npm test
```

`python .\build.py --check` fails if the generated files are out of date. Edit the source `.js` files and `build.py`, never the generated `.txt` and `.user.js` files. Shared code lives in `lib/` and is added with `/* @include lib/name.js */`.

These tests run the compiled rules against simulated pages. They do not replace testing in a live browser.

Contributions and improvements are welcome.

## Credits and references

This project was developed using research and implementation techniques from several open-source projects:

- [YouTube Anti Translate](https://github.com/zpix1/yt-anti-translate) — YouTube original metadata and audio restoration.
- [Google Search — No Auto-Translate](https://greasyfork.org/en/scripts/570066-google-search-no-auto-translate/code) — Original Google Search result restoration.
- [No Google Search Translation](https://github.com/lnoss/no-google-search-translation) — Additional Google Search research.
- [redditUntranslate](https://github.com/SeidSmatti/redditUntranslate) — Reddit translation behavior research.
- [AdGuard Documentation](https://adguard.com/kb/general/ad-filtering/create-own-filters/) — Filtering syntax and capabilities.

See `NOTICE.md` for additional attribution and licensing information.

## License

Released under the **MIT License**. See [LICENSE](LICENSE) for details.

---

**Original Language for AdGuard** — Browse the web in its original language, without unwanted translations.
