/**
 * serve-admin.mjs — tiny local server for the FAQ editor.
 *
 *   npm run admin
 *
 * Serves the project folder at http://localhost:4141 and points you at the
 * editor. Running over http://localhost (rather than opening the file directly)
 * lets Chrome/Edge save changes straight back into src/_data/faqs.json.
 * Uses only Node's built-in modules — no dependencies.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = 4141;
const ROOT = process.cwd();
const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    // Prevent path traversal outside the project root.
    const full = normalize(join(ROOT, path));
    if (!full.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }
    const body = await readFile(full);
    res.writeHead(200, { "Content-Type": TYPES[extname(full)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`\n  FAQ editor running:  http://localhost:${PORT}/admin/\n`);
  console.log("  Open that URL in Chrome or Edge, click “Open faqs.json”,");
  console.log("  choose src/_data/faqs.json, edit, and Save. Ctrl/Cmd+C to stop.\n");
});
