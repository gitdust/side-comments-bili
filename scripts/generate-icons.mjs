import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const svg = await readFile("public/logo.svg", "utf8");
await mkdir("public/icons", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const size of [16, 32, 48, 128]) {
    const png = await page.evaluate(async ({ svg, size }) => {
      const image = new Image();
      image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.getContext("2d").drawImage(image, 0, 0, size, size);
      return canvas.toDataURL("image/png").split(",")[1];
    }, { svg, size });
    await writeFile(`public/icons/icon${size}.png`, Buffer.from(png, "base64"));
  }
} finally {
  await browser.close();
}
