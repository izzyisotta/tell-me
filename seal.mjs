// Seal the shortcut (an iCloud link, or the signed .shortcut file itself) behind a codeword.
// Usage:  node seal.mjs <codeword> --url "https://www.icloud.com/shortcuts/..."
//         node seal.mjs <codeword> --file "private/Debrief.shortcut"
// Writes sealed.json next to index.html. The page decrypts it in the browser with WebCrypto
// (PBKDF2-SHA256 -> AES-GCM-256), so the public repo never carries the link or the file in clear.
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
const [pw, mode, val] = process.argv.slice(2);
if (!pw || !['--url', '--file'].includes(mode) || !val) {
  console.error('usage: node seal.mjs <codeword> --url <link> | --file <path>');
  process.exit(2);
}
const payload = mode === '--url'
  ? { type: 'url', value: val }
  : { type: 'file', name: basename(val), value: readFileSync(val).toString('base64') };
const enc = new TextEncoder(), iter = 310000;
const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
const km = await crypto.subtle.importKey('raw', enc.encode(pw.trim().toLowerCase()), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(payload))));
const b64 = u8 => Buffer.from(u8).toString('base64');
writeFileSync('sealed.json', JSON.stringify({ iter, salt: b64(salt), iv: b64(iv), ct: b64(ct), kind: payload.type }));
console.log(`sealed ${payload.type} (${ct.length} bytes) into sealed.json`);
