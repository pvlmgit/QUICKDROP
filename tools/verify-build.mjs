import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const worker = readFileSync("src/index.js", "utf8");
const b64 = worker.match(/const B64_UPLOAD = "([^"]*)"/)[1];
const html = gunzipSync(Buffer.from(b64, "base64")).toString("utf8");

console.log("decompressed bytes:", html.length);
console.log("has mode-switch CSS:    ", html.includes("mode-switch"));
console.log("has mode buttons:       ", html.includes('id="modeFolderBtn"'));
console.log('shares mode via API:    ', html.includes('mode: currentMode === "folder" ? "share" : "send"'));
console.log("round-trips to disk:    ", html === readFileSync("index.html", "utf8"));