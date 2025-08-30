function addBOM() {
	return {
		name: "add-bom",
		generateBundle(options, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type === "chunk" && typeof file.code === "string") {
					file.code = "\uFEFF" + file.code;
				}
			}
			console.log("\u001b[1;1m utf-8 BOM を追加。\u001b[0m");
		},
	};
}

export default {
	input: `${process.env.TARGET_FILE}`,
	output: {
		dir: "dist", // 「dist」ディレクトリーの下にビルド後のファイルを生成する
		entryFileNames: "[name].js", // 生成物のファイル名は input のキー名とする
		// 今回は「desktop.js」というファイルが生成される
	},
	plugins: [addBOM()],
};
