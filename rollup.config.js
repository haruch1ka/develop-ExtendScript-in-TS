function addBOM() {
	return {
		name: "add-bom",
		generateBundle(options, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type === "chunk" && typeof file.code === "string") {
					file.code = "\uFEFF" + file.code;
				}
			}
			console.log("BOM added to the output files.");
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
