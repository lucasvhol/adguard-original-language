# Original Language for AdGuard

**Stop unwanted automatic translations and experience websites in their original language.**

Original Language is a collection of custom AdGuard filters designed to reduce automatic translation across popular websites, including Google Search, YouTube, Reddit, X (Twitter), and LinkedIn.

Whether you're tired of translated YouTube titles, AI-dubbed videos, or Google changing search results into another language, these filters help preserve the original content whenever possible.

No additional browser extension is needed beyond a compatible AdGuard installation.

## Features

| Website | What the filter does |
|---|---|
| **Google Search** | Restores original search result titles and descriptions when available. |
| **YouTube** | Attempts to restore original video titles and automatically select original audio tracks. |
| **Reddit** | Removes translation parameters from Reddit links to display posts in their original language. |
| **Google Translate** | Redirects supported translated webpage links to the original website. |
| **X (Twitter)** | Optionally switches translated posts back to their original language. |
| **LinkedIn** | Optionally displays the original text of translated posts. |

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

### Step 3 — Optional social media support

For additional support on X (Twitter) and LinkedIn, you can install this experimental filter:

```text
https://raw.githubusercontent.com/lucasvhol/adguard-original-language/main/optional-social-originals.txt
```

Follow the same installation steps above.

This filter is entirely optional and separate from the main filter because social media interfaces change frequently.

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

**Important:** This project is not a universal translation blocker. Some websites perform translations directly on their servers, making original content unavailable to standard content filters.

## Known limitations

- **YouTube:** Original titles and audio selection are experimental. Video descriptions, subtitles, thumbnails, chapters, and mobile-specific interfaces are not fully supported.
- **Google Search:** Original titles and snippets can only be restored when Google's page contains the necessary information.
- **Reddit:** The filter removes translation parameters from URLs but does not change Reddit account preferences.
- **X and LinkedIn:** Optional restoration relies on visible interface controls and may be affected by website updates.
- **Google Translate:** Links to supported translated webpages are redirected to the original site, including when translation was requested manually.
- **Browser translation:** Chrome's built-in translation feature must be configured separately through `chrome://settings/languages`.

For more complete YouTube translation controls, consider [YouTube Anti Translate](https://github.com/zpix1/yt-anti-translate).

## Troubleshooting

**The filter isn't working**

Check that AdGuard is enabled, that the custom filter is marked as Trusted, and that JavaScript filtering is permitted by your browser. Reload the affected website afterward.

**YouTube is still translating some content**

YouTube frequently changes its interface. Some translation features may require the dedicated YouTube Anti Translate extension.

**A website behaves unexpectedly**

Temporarily disable the Original Language filter and reload the page. If the issue disappears, the filter may be interfering with the website.

**How do I uninstall it?**

Open **AdGuard → Settings → Filters → Custom filters** and remove or disable the Original Language subscriptions.

## Updates

The filters are hosted directly on GitHub, making them easy to maintain and update.

Once subscribed, AdGuard can periodically check for new versions without requiring you to download the filter again.

Updates may include improvements to existing websites, support for additional platforms, compatibility fixes, and performance optimizations.

For issues or feature suggestions, visit the [GitHub repository](https://github.com/lucasvhol/adguard-original-language) and open an issue.

## For developers

The repository includes readable JavaScript source files, a Python build script, and automated tests.

To rebuild the filters and run the test suites:

```powershell
python .\build.py
node .\tests\smoke.cjs
node .\tests\google.cjs
```

These tests validate rule generation and simulated website behavior. They do not replace testing in a live browser.

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
