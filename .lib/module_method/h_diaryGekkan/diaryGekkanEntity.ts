export class diaryGekkanPageEntity {
	yearTextFrame: TextFrame;
	monthTextFrame: TextFrame;
	constructor(page: Page) {
		const textFrames = page.textFrames;
		this.monthTextFrame = textFrames.itemByName("tuki");
		this.yearTextFrame = textFrames.itemByName("nen");

		$.writeln(this.monthTextFrame);
		$.writeln(this.yearTextFrame);
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
