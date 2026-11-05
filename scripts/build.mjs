import { mkdir, copyFile, readFile, rm, cp } from "node:fs/promises";
import { build } from "esbuild";

await mkdir("dist", { recursive: true });
await build({
  entryPoints: ["src/content.ts"],
  outdir: "dist",
  bundle: true,
  format: "iife",
  target: "chrome120",
  define: {
    __SIDE_COMMENTS_LOGO__: JSON.stringify(await readFile("public/logo.svg", "utf8")),
  },
});
await Promise.all([
  copyFile("public/manifest.json", "dist/manifest.json"),
  copyFile("src/content.css", "dist/content.css"),
  copyFile("public/logo.svg", "dist/logo.svg"),
  cp("public/icons", "dist/icons", { recursive: true }),
]);
await rm("dist/background.js", { force: true });
