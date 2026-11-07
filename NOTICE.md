# Attribution and sources

This project references and independently adapts approaches from the following projects:

- [YouTube Anti Translate](https://github.com/zpix1/yt-anti-translate), by Ivan Baksheev (MIT for its core; the explicitly excluded mobile audio source was not used).
- [Google Search — No Auto-Translate](https://greasyfork.org/en/scripts/570066-google-search-no-auto-translate/code), by EstebanAlpha (MIT).
- [redditUntranslate](https://github.com/SeidSmatti/redditUntranslate) (GPL-3.0 research reference; no code copied).
- [No Google Search Translation](https://github.com/lnoss/no-google-search-translation) (GPL-3.0 research reference; no code copied).

YouTube page and player selectors, the `#shorts-player` handling, and the player-response source for descriptions and channel names were identified from YouTube Anti Translate. The `*.translate.goog` hostname decoding follows [Google's published steps](https://developers.google.com/search/docs/appearance/ad-network-and-translation).

The filter's URL-parameter and site-injection techniques are reimplemented here; do not assume full feature parity with the referenced extensions. See README.md for functionality and limitations.
