import { existsSync, readFileSync } from "node:fs";

for (const path of [
  "AGENTS.md",
  "src/App.tsx",
  "src/app",
  "src/features",
  "src/shared",
]) {
  if (!existsSync(path))
    throw new Error(`Required architecture path is missing: ${path}`);
}

const main = readFileSync("src/main.tsx", "utf8");
const app = readFileSync("src/App.tsx", "utf8");

if (
  !/import App from ['"]\.\/App(?:\.tsx)?['"]/.test(main) ||
  !/<App\s*\/>/.test(main)
) {
  throw new Error("src/main.tsx must mount src/App.tsx");
}

for (const component of ["AppRouter", "AuthProvider", "ThemeProvider"]) {
  if (!app.includes(`<${component}`))
    throw new Error(`src/App.tsx must compose ${component}`);
}
