import { createServer } from "node:http";
import { createReadStream, statSync, mkdirSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const output = resolve(root, "output/playwright");
const modulePath =
  process.env.PLAYWRIGHT_MODULE ||
  "/home/leeeen/.npm-global/lib/node_modules/@playwright/cli/node_modules/playwright/index.mjs";
const { firefox } = await import(pathToFileURL(modulePath));
const types = {
  ".html": "text/html",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};
const server = createServer((req, res) => {
  const file = resolve(
    root,
    "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
  );
  if (!file.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const stat = statSync(file);
    const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
    const start = range ? Number(range[1]) : 0;
    const end = range?.[2] ? Number(range[2]) : stat.size - 1;
    const headers = {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    };
    if (range) headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
    res.writeHead(range ? 206 : 200, headers);
    createReadStream(file, { start, end }).pipe(res);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(8767, "127.0.0.1", resolve));
let browser;
try {
  browser = await firefox.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(60000);
  await page.goto("http://127.0.0.1:8767/presentacion/video-demo/index.html");
  await page.evaluate(() => window.ready);
  const errors = await page.evaluate(() =>
    [...document.querySelectorAll("video")]
      .filter((v) => v.error)
      .map((v) => v.id),
  );
  if (errors.length)
    throw new Error(`Video decoding failed: ${errors.join(", ")}`);
  await page.locator("#play").evaluate((el) => (el.style.display = "none"));
  mkdirSync(resolve(output, "html-preview"), { recursive: true });
  for (const t of [1.2, 2.8, 5.5, 7, 9.5, 12.2, 15, 18.5, 22, 25, 28.5]) {
    await page.evaluate((t) => window.renderAt(t), t);
    await page.screenshot({ path: resolve(output, `html-preview/${t}.png`) });
  }
  console.log("HTML previews ready.");
  if (!process.argv.includes("--preview")) {
    const file = resolve(output, "TwinNauta-30s-EN-HTML.mp4");
    const encoder = spawn(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "image2pipe",
        "-framerate",
        "30",
        "-vcodec",
        "mjpeg",
        "-i",
        "pipe:0",
        "-i",
        resolve(output, "twinnauta-score.wav"),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-af",
        "volume=0.75",
        "-c:v",
        "libx264",
        "-threads",
        "4",
        "-preset",
        "fast",
        "-crf",
        "16",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        file,
      ],
      { stdio: ["pipe", "inherit", "inherit"] },
    );
    const finished = once(encoder, "close");
    for (let frame = 0; frame < 900; frame++) {
      await page.evaluate((t) => window.renderAt(t), frame / 30);
      const jpeg = await page.screenshot({ type: "jpeg", quality: 98 });
      if (!encoder.stdin.write(jpeg)) await once(encoder.stdin, "drain");
      if (frame % 90 === 0) console.log(`Rendered ${frame}/900 frames`);
    }
    encoder.stdin.end();
    const [code] = await finished;
    if (code !== 0) throw new Error(`FFmpeg exited with ${code}`);
    console.log(file);
  }
} finally {
  await browser?.close();
  server.close();
}
