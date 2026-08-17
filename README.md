# tell-me

A one-page ask to friends for voice notes. Public, `noindex`, no product details.

- `index.html` - the page.
- `sealed.json` - the shortcut (an iCloud link, or the signed file) encrypted behind a codeword; made by `seal.mjs`. Nothing in this repo carries the link or the file in clear.
- `private/` - gitignored: the signed shortcut, which embeds an upload endpoint.

Reseal after making the iCloud link in the Shortcuts app: `node seal.mjs <codeword> --url "<link>"`, commit, push.
