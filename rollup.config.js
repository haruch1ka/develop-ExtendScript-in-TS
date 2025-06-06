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
	input: "compiled/index.js",
	output: {
		dir: "dist",
		format: "esm",
	},
	plugins: [addBOM()],
};
