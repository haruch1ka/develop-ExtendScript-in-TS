export class diaryCalenderPageEntity {
	dayEntityList: diaryCalenderDayEntity[];
	allDayEntityArray: TextFrame[];

	constructor(page: Page) {
		const allNameList = [
			"txf1a",
			"txf1b",
			"txf1c",
			"txf1d",
			"txf1e",
			"txf1f",
			"txf1g",
			"txf2a",
			"txf2b",
			"txf2c",
			"txf2d",
			"txf2e",
			"txf2f",
			"txf2g",
			"txf3a",
			"txf3b",
			"txf3c",
			"txf3d",
			"txf3e",
			"txf3f",
			"txf3g",
			"txf4a",
			"txf4b",
			"txf4c",
			"txf4d",
			"txf4e",
			"txf4f",
			"txf4g",
			"txf5a",
			"txf5b",
			"txf5c",
			"txf5d",
			"txf5e",
			"txf5f",
			"txf5g",
		];
		const textFrames = page.textFrames;
		/*@ts-ignore*/
		this.dayEntityList = allNameList.map((_, i) => {
			return textFrames.itemByName(allNameList[i]);
		});
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
