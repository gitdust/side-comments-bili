import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, existsSync } from "node:fs";

const manifest = JSON.parse(readFileSync("public/manifest.json", "utf8"));
const version = manifest.version || "0.1.0";
const zipName = `side-comments-v${version}.zip`;

mkdirSync("release", { recursive: true });

// Ensure dist is built
execFileSync("node", ["scripts/build.mjs"], { stdio: "inherit" });

// Zip contents of dist
execFileSync("zip", ["-r", `../release/${zipName}`, "."], {
  cwd: "dist",
  stdio: "inherit",
});

console.log(`\n📦 Successfully packaged extension: release/${zipName}\n`);
