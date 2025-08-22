const unlockLay = () => {
	for (let i = 0; i < app.activeDocument.layers.length; i++) {
		app.activeDocument.layers[i].locked = false;
	}
};

export default unlockLay;
