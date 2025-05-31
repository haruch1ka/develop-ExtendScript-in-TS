import { execSync } from "child_process";
import path from "path";

try {
	// TypeScriptのコンパイル
	console.log("TypeScriptをコンパイル中...");
	execSync("npx tsc", { stdio: "inherit" });

	// Rollupでバンドル
	console.log("Rollupでバンドル中...");
	execSync("npx rollup -c", { stdio: "inherit" });

	console.log("ビルドが完了しました。");
} catch (error) {
	console.error("ビルド中にエラーが発生しました:", error.message);
	process.exit(1);
}
