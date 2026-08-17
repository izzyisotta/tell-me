# tell-me

A one-page ask to friends for voice notes. Public, `noindex`, no product details.

- `index.html` - the page.
- `shortcut.json` - the shortcut the page hands out: `{"type":"url","value":"<iCloud link>"}` or `{"type":"file","name":"Debrief.shortcut","value":"<base64>"}`. The password gate was dropped on 17 Aug (her word: what it guarded is a public-by-design key on an insert-only bucket); `seal.mjs` is kept in case it comes back.
- `audio/` - the two example recordings.
- `private/` - gitignored: the signed shortcut file.

To switch to the iCloud link once it exists: write `{"type":"url","value":"<link>"}` to `shortcut.json`, commit, push.
