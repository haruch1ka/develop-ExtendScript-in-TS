import diaryDayEntity from "./diaryDayEntity";

export class diaryPageEntity {
	dayEntityList: diaryDayEntity[];
	monthTextFrame: TextFrame;
	monthEnglishTextFrame: TextFrame;
	sengetsuTextFrame: TextFrame;
	constructor(page: Page) {
		const textFrames = page.textFrames;
		this.sengetsuTextFrame = textFrames.itemByName("sengetsu");
		this.monthTextFrame = textFrames.itemByName("tuki");
		this.monthEnglishTextFrame = textFrames.itemByName("tukieng");
		/*@ts-ignore*/
		this.dayEntityList = [...Array(7)].map((_, i) => {
			return new diaryDayEntity(i + 1, textFrames);
		});
	}
}

export class firstPageEntity {
	page: Page;
	dayStory: Story;
	rokuyouStory: Story;
	holidayStory: Story;
	constructor(page: Page) {
		this.page = page;
		const textFrames = page.textFrames;
		const dayItem: TextFrame = textFrames.itemByName("niti1");
		const rokuyouItem: TextFrame = textFrames.itemByName("roku1");
		const holidayItem: TextFrame = textFrames.itemByName("syuk1");
		this.dayStory = dayItem.parentStory;
		this.rokuyouStory = rokuyouItem.parentStory;
		this.holidayStory = holidayItem.parentStory;
	}
}
