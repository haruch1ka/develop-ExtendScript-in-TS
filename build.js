import { execSync } from "child_process";
import path from "path";

try {
	// TypeScriptのコンパイル
	console.log("\u001b[1;5;36m TypeScriptをコンパイル中... \u001b[0m");
	execSync("pnpm tsc", { stdio: "inherit" });

	// Rollupでバンドル
	console.log("\u001b[1;5;36m Rollupでバンドル中... \u001b[0m");
	execSync("pnpm rollup", { stdio: "inherit" });

	console.log("ビルドが完了しました。");
} catch (error) {
	console.error("ビルド中にエラーが発生しました:", error.message);
	process.exit(1);
}
