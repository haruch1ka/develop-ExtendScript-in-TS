export class diaryGekkanEvenPageEntity {
	monthTextFrame: TextFrame;
	dayTextFrame: TextFrame;
	constructor(page: Page) {
		const textFrames = page.textFrames;
		this.monthTextFrame = textFrames.itemByName("tuki");
		this.dayTextFrame = textFrames.itemByName("niti1");
	}
}
export class diaryGekkanOddPageEntity {
	yearTextFrame: TextFrame;
	constructor(page: Page) {
		const textFrames = page.textFrames;
		this.yearTextFrame = textFrames.itemByName("nen");
	}
}

export class firstPageEntity {
	page: Page;
	dayStory: Story;
	weekStory: Story;
	holidayStory: Story;
	dayInsertionPoint: InsertionPoint;

	constructor(page: Page) {
		this.page = page;
		const textFrames = page.textFrames;
		const dayItem: TextFrame = textFrames.itemByName("niti1");
		const weekItem: TextFrame = textFrames.itemByName("you1");
		const holidayItem: TextFrame = textFrames.itemByName("shuk1");

		this.dayStory = dayItem.parentStory;
		this.weekStory = weekItem.parentStory;
		this.holidayStory = holidayItem.parentStory;
		this.dayInsertionPoint = dayItem.insertionPoints[0];
	}
}
