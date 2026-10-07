/**
 * Packs index.html and download.html into src/index.js as gzip+base64 blobs.
 * The Worker serves them via DecompressionStream, so the repo stays a
 * single self-contained Worker script with no asset bindings.
 *
 * Usage: node tools/build.mjs
 */
import { gzipSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pack = (name) => gzipSync(readFileSync(join(root, name))).toString("base64");

const upload = pack("index.html");
const download = pack("download.html");

const workerPath = join(root, "src", "index.js");
const worker = readFileSync(workerPath, "utf8");

const swap = (src, label, next) => {
  const re = new RegExp(`const ${label} = "[^"]*";`);
  if (!re.test(src)) throw new Error(`could not find const ${label} in src/index.js`);
  return src.replace(re, `const ${label} = "${next}";`);
};

const out = swap(swap(worker, "B64_UPLOAD", upload), "B64_DOWNLOAD", download);
writeFileSync(workerPath, out);

const kb = (n) => (n / 1024).toFixed(1) + " KiB";
console.log(`index.html    -> B64_UPLOAD    ${kb(upload.length)}`);
console.log(`download.html -> B64_DOWNLOAD  ${kb(download.length)}`);
console.log(`src/index.js  ${kb(out.length)}`);