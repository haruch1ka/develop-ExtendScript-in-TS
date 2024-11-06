export class diaryGekkanDayStructure {
	dayText: string;
	weekText: string;
	holidayText: string;
	monthText: string;
	yearText: string;
	isHoliday: boolean;
	//日曜日かどうか
	isSunday: boolean;
	//土曜日かどうか
	isSaturday: boolean;

	constructor(daytext: string, weektext: string, holidaytext: string, monthtext: string, yeartext: string) {
		this.dayText = daytext;
		this.weekText = weektext;
		this.holidayText = holidaytext;
		this.monthText = monthtext;
		this.yearText = yeartext;
		this.isHoliday = false;
		this.isSaturday = false;
		this.isSunday = false;
	}
}
export class diaryGekkanPageStructure {
	yearText = "";
	monthText = "";
	dayStructureArray: diaryGekkanDayStructure[];
	leftPageHolidayArray: boolean[] = [];
	rightPageHolidayArray: boolean[] = [];
	leftPageSaturdayArray: boolean[] = [];
	rightPageSaturdayArray: boolean[] = [];
	constructor(dayStructureArray: diaryGekkanDayStructure[]) {
		this.dayStructureArray = dayStructureArray;
		this.yearText = dayStructureArray[0].yearText;
		this.monthText = dayStructureArray[0].monthText;
		for (let i = 0; i < dayStructureArray.length; i++) {
			if (i >= 0 && i < 16) {
				dayStructureArray[i].isHoliday || dayStructureArray[i].isSunday
					? this.leftPageHolidayArray.push(true)
					: this.leftPageHolidayArray.push(false);
				dayStructureArray[i].isSaturday ? this.leftPageSaturdayArray.push(true) : this.leftPageSaturdayArray.push(false);
			} else if (i >= 16) {
				dayStructureArray[i].isHoliday || dayStructureArray[i].isSunday
					? this.rightPageHolidayArray.push(true)
					: this.rightPageHolidayArray.push(false);
				dayStructureArray[i].isSaturday ? this.rightPageSaturdayArray.push(true) : this.rightPageSaturdayArray.push(false);
			}
		}
	}
}

export const getTextframeIndex = (from: Number, to: Number, index: Number) => {
	/*@ts-ignore*/
	const txtFrameArray = [...Array(to - from + 1)].map((_, i) => from + i + 1);

	const tarArray = txtFrameArray
		/*@ts-ignore*/
		.map((v) => v.toString().length + 1);
	const res = tarArray
		/*@ts-ignore*/
		.map((v, i) => [tarArray.slice(0, i + 1).reduce((acc, cur) => acc + cur) - 1, v]);

	return res[index];
};
