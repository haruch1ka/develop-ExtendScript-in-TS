export class diaryCalenderPageEntity {
	textFrames: TextFrames;
	sundayItemList: TextFrame[];
	saturdayItemList: TextFrame[];
	constructor(page: Page) {
		const sundayNameList = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
		const saturdayNameList = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];
		this.textFrames = page.textFrames;
		/*@ts-ignore*/
		this.sundayItemList = sundayNameList.map((name) => this.textFrames.itemByName(name));
		/*@ts-ignore*/
		this.saturdayItemList = saturdayNameList.map((name) => this.textFrames.itemByName(name));
	}
	getByName(name: string): TextFrame {
		return this.textFrames.itemByName(name);
	}
}

export class firstPageEntity {
	page: Page;
	dayStory: Story;
	dayInsertionPoint: InsertionPoint;
	constructor(page: Page) {
		this.page = page;
		const textFrames = page.textFrames;
		const dayItem: TextFrame = textFrames.itemByName("txf1a");
		this.dayStory = dayItem.parentStory;
		this.dayInsertionPoint = dayItem.insertionPoints[0];
	}
}
