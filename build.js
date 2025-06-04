import { execSync } from "child_process";
import path from "path";

try {
	// TypeScriptのコンパイル
	console.log("TypeScriptをコンパイル中...");
	execSync("pnpm tsc", { stdio: "inherit" });

	// Rollupでバンドル
	console.log("Rollupでバンドル中...");
	execSync("pnpm rollup", { stdio: "inherit" });

	console.log("ビルドが完了しました。");
} catch (error) {
	console.error("ビルド中にエラーが発生しました:", error.message);
	process.exit(1);
}
