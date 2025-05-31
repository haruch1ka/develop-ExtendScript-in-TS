const { execSync } = require("child_process");
const path = require("path");

try {
	// TypeScriptのコンパイル
	console.log("TypeScriptをコンパイル中...");
	execSync("pn tsc", { stdio: "inherit" });

	// Rollupでバンドル
	console.log("Rollupでバンドル中...");
	execSync("pn rollup -c", { stdio: "inherit" });

	console.log("ビルドが完了しました。");
} catch (error) {
	console.error("ビルド中にエラーが発生しました:", error.message);
	process.exit(1);
}
