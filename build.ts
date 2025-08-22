import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import targetFileList from "./targetFileList.ts";
import { dotenv } from "dotenv";
import { fileURLToPath } from "url";

const logBlue = (message: string) => {
	console.log("\u001b[1;5;36m" + message + "\u001b[0m");
};

const executeCheckTypes = () => {
	logBlue("\nTypeScriptの型チェック...");
	execSync(`pnpm tsc --project tsconfig.json --noEmit`, { stdio: "inherit" });
};

const executeBuild = () => {
	logBlue("\nviteでバンドル中...\n");
	execSync(`pnpm vite build --config vite.config.ts`, { stdio: "inherit" });
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "dist");

try {
	executeCheckTypes();
	for (const targetName of targetFileList) {
		// scriptsフォルダ以下を再帰的に検索して、対象ファイルがあるか確認し、パスを返す
		const findFileRecursively = (dir: string, targetFiles: string[]): string | null => {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = `${dir}/${entry.name}`;
				if (entry.isDirectory()) {
					const found = findFileRecursively(fullPath, targetFiles);
					if (found) return found;
				} else if (targetFiles.includes(entry.name)) {
					return fullPath;
				}
			}
			return null;
		};

		const targetFiles = [`${targetName}.ts`, `${targetName}.tsx`];
		const foundFilePath = findFileRecursively("src/__lib", targetFiles);

		logBlue(`ビルド対象: ${targetName}\n`);
		if (!foundFilePath) {
			console.warn(`警告: ${targetName}.ts または ${targetName}.tsx が存在しません。スキップします。\n`);
			continue;
		} else {
			process.env.TARGET_FILENAME = targetName;
			process.env.TARGET_FILE = foundFilePath;
			executeBuild();
		}
	}

	// BabelでES3変換
	console.log("\n\u001b[1;5;36m BabelでES3変換中... \u001b[0m");
	execSync("pnpm exec babel dist --out-dir dist --presets=@babel/preset-env", { stdio: "inherit" });

	// BOM付与処理
	console.log("\n\u001b[1;5;36m BOM付与中... \u001b[0m");
	fs.readdirSync(distDir).forEach((file) => {
		if (file.endsWith(".js")) {
			const filePath = path.join(distDir, file);
			const content = fs.readFileSync(filePath);
			// 既にBOMが付いていない場合のみ付与
			if (!content.slice(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
				fs.writeFileSync(filePath, Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), content]));
			}
		}
	});
	logBlue(`\nビルドが完了しました`);
} catch (error) {
	console.error("\nビルド中にエラーが発生しました:", error.message);
	process.exit(1);
}
