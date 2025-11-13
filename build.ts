import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import targetFileList from "./targetFileList.ts";
import { dotenv } from "dotenv";
import { fileURLToPath } from "url";

const logBlue = (message: string) => {
  console.log("\u001b[1;5;36m" + message + "\u001b[0m");
};

class Execute {
  execution(message: string, command: string) {
    logBlue(message);
    execSync(command, { stdio: "inherit" });
  }
  checkTypes() {
    this.execution("\nTypeScriptの型チェック...", `pnpm tsc --project tsconfig.json --noEmit`);
  }
  tsc() {
    this.execution("\nTypeScriptのコンパイル中...", `pnpm tsc --project tsconfig.json`);
  }
  rollup() {
    this.execution("\nRollupでバンドル中...\n", `pnpm rollup -c ./config/rollup.config.ts`);
  }
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "dist");
const _execute = new Execute();
const findFileRecursively = (dir: string, targetFiles: string[]): string | null => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      // "lib" を含むディレクトリは除外
      if (entry.name.includes("_util")) continue;
      const found = findFileRecursively(fullPath, targetFiles);
      if (found) return found;
    } else if (targetFiles.includes(entry.name)) {
      return fullPath;
    }
  }
  return null;
};
try {
  _execute.checkTypes();
  for (const targetName of targetFileList) {
    // scriptsフォルダ以下を再帰的に検索して、対象ファイルがあるか確認し、パスを返す
    const foundFilePath = findFileRecursively(
      "src/",
      [".ts", ".tsx"].map((ext) => `${targetName}${ext}`),
    );
    logBlue(`ビルド対象: ${targetName}\n`);
    if (!foundFilePath) {
      console.warn(`警告: ${targetName}.ts または ${targetName}.tsx が存在しません。スキップします。\n`);
      continue;
    } else {
      process.env.TARGET_FILENAME = targetName;
      const replacedPath = foundFilePath.replace("src/", "compiled/").replace(/\.tsx?$/, ".js");
      process.env.TARGET_FILE = replacedPath;

      _execute.tsc();
      _execute.rollup();
    }
  }

  logBlue(`\nビルドが完了しました`);
} catch (error) {
  console.error("\nビルド中にエラーが発生しました:", error.message);
  process.exit(1);
}
