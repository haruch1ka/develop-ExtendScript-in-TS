export class diaryCalenderDayStructure {
	dayText: string;
	//祝日かどうか
	isHoliday: boolean;
	//別れているかどうか
	isSeparated: boolean;
	//日曜日かどうか
	isSunday: boolean;
	//土曜日かどうか
	isSaturday: boolean;
	//祝日かどうか
	constructor(daytext: string) {
		this.dayText = daytext;
		this.isHoliday = false;
		this.isSeparated = false;
		this.isSunday = false;
		this.isSaturday = false;
	}
}

export class diaryCalenderPageStructure {
	dayStructureArray: diaryCalenderDayStructure[];
	constructor(dayStructureArray: diaryCalenderDayStructure[]) {
		this.dayStructureArray = dayStructureArray;
	}
}
