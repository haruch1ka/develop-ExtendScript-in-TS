export class diaryDayEntity {
	dayIndex: number;
	dayTextFrame: TextFrame;
	weekTextFrame: TextFrame;
	rokuyouTextFrame: TextFrame;
	holidayTextFrame: TextFrame;
	constructor(dayIndex: number, TextFrames: TextFrames) {
		this.dayIndex = dayIndex;
		this.dayTextFrame = TextFrames.itemByName("niti" + dayIndex);
		this.weekTextFrame = TextFrames.itemByName("you" + dayIndex);
		this.rokuyouTextFrame = TextFrames.itemByName("roku" + dayIndex);
		this.holidayTextFrame = TextFrames.itemByName("shuk" + dayIndex);
	}
}

export default diaryDayEntity;
