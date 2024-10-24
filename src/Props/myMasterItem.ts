export class myMasterPageItem {
	master: any;
	constructor(pageNum: number) {
		this.master = app.activeDocument.masterSpreads[pageNum];
		$.writeln(this.master.name);
	}
	getTextFrame(name: string, to: Page): TextFrame {
		const textFrame = this.master.textFrames.itemByName(name);
		const duplicatedItem = textFrame.duplicate(to, [0, 0]);
		return duplicatedItem;
	}
}

export default myMasterPageItem;
