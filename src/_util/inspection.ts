export const getInddItemType = (item: PageItem) => {
	return item.constructor.name;
};

export const getInddSwatchesNames = (doc: Document) => {
	const swatches: Swatches = doc.swatches;
	const len = swatches.length;
	let res = "";
	for (let i = 0; i < len; i++) {
		const swatche: Swatch = swatches[i];
		res += swatche.name + "\n";
	}
	alert(res);
	alert("complete");
};
