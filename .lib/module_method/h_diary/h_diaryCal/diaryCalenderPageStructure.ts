export class diaryCalenderDayStructure {
	dayText: string;
	afterText: string;
	//祝日かどうか
	isHoliday: boolean;
	//別れているかどうか
	isSeparated: boolean;
	//日曜日かどうか
	isSunday: boolean;
	//土曜日かどうか
	isSaturday: boolean;
	//ドットであるかどうか
	isDot: boolean;
	//別れていて祝日の前かどうか
	isLeftHoliday: boolean;
	//別れていて祝日の後かどうか
	isRightHoliday: boolean;
	constructor(daytext: string, aftertext: string = "") {
		this.dayText = daytext;
		this.afterText = aftertext;
		this.isHoliday = false;
		this.isSeparated = false;
		this.isSunday = false;
		this.isSaturday = false;
		this.isDot = false;
		this.isLeftHoliday = false;
		this.isRightHoliday = false;
	}
}

export class diaryCalenderPageStructure {
	dayStructureArray: diaryCalenderDayStructure[];

	constructor(dayStructureArray: diaryCalenderDayStructure[]) {
		this.dayStructureArray = dayStructureArray;
	}
}
