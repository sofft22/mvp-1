// Syntax-checks every JavaScript file and the inline scripts in the HTML pages.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    if (f === "node_modules" || f.startsWith(".")) continue;
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(m?js)$/.test(f)) files.push(p);
    else if (f.endsWith(".html")) {
      const html = readFileSync(p, "utf8");
      const tmp = mkdtempSync(join(tmpdir(), "bs-"));
      [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/json")[^>]*>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
        const out = join(tmp, `${f}.${i}.mjs`);
        writeFileSync(out, m[1]);
        files.push(out);
      });
    }
  }
})(".");

let bad = 0;
for (const f of files) {
  try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); }
  catch (e) { bad++; console.error("SYNTAX ERROR:", f, "\n" + e.stderr.toString()); }
}
console.log(`${files.length} scripts checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
