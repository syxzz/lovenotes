#!/usr/bin/env node
/**
 * 本地预览静态导出（模拟 GitHub Pages 的 basePath 路径）
 * 将 out/ 放到 preview/<basePath>/ 下并启动 serve，访问根路径会重定向到 basePath
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const basePath = "/lovenotes"; // 与 next.config 中 basePath 保持一致
const previewDir = join(root, "preview");
const targetDir = join(previewDir, basePath.slice(1)); // lovenotes

rmSync(previewDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(join(root, "out"), targetDir, { recursive: true });

writeFileSync(
  join(previewDir, "index.html"),
  `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${basePath}/"><title>Redirect</title></head><body>Redirecting to <a href="${basePath}/">${basePath}/</a></body></html>`
);

const { spawn } = await import("child_process");
const serve = spawn("npx", ["serve", "preview", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
console.log("\n✅ 请在浏览器打开: http://localhost:3000 或 http://localhost:3000" + basePath + "/\n");
serve.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
serve.on("close", (code) => process.exit(code ?? 0));
