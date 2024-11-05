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
	monthHolidayArray: boolean[] = [];
	constructor(dayStructureArray: diaryGekkanDayStructure[]) {
		this.dayStructureArray = dayStructureArray;
		this.yearText = dayStructureArray[0].yearText;
		this.monthText = dayStructureArray[0].monthText;
		for (let i = 0; i < dayStructureArray.length; i++) {
			if (dayStructureArray[i].isHoliday) {
				this.monthHolidayArray.push(true);
			} else {
				this.monthHolidayArray.push(false);
			}
		}
	}
}
