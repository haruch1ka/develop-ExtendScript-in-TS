export class diaryPageStructure {
	dayStructureArray: diaryDayStructure[];
	monthText: string;
	monthEnglishText: string;
	sengetsuText: string;
	constructor(dayStructureArray: diaryDayStructure[]) {
		const first = dayStructureArray[0];
		const last = dayStructureArray[6];
		const isMonthTextDifferent = first.monthText !== last.monthText ? true : false;
		const isLastGlay = last.isGlay ? true : false;
		const isSengetsu = isMonthTextDifferent && !isLastGlay ? true : false;
		this.dayStructureArray = dayStructureArray;
		this.monthText = !isLastGlay ? last.monthText : dayStructureArray[0].monthText;
		this.monthEnglishText = this.getEng(last.monthText);
		this.sengetsuText = isSengetsu ? first.monthText + "/" : "";
	}
	getEng(string: string) {
		const monthEnglishTextList: { [key: string]: string } = {
			"1": "January",
			"2": "February",
			"3": "March",
			"4": "April",
			"5": "May",
			"6": "June",
			"7": "July",
			"8": "August",
			"9": "September",
			"10": "October",
			"11": "November",
			"12": "December",
		};
		return monthEnglishTextList[string];
	}
}

export class diaryDayStructure {
	monthText: string;
	youbiText: string;
	holidayText: string;
	isGlay: boolean;
	constructor(data: string[]) {
		this.monthText = data[2];
		this.youbiText = data[6];
		this.holidayText = data[7];
		this.isGlay = false;
	}
	setGlayActivate() {
		this.isGlay = true;
	}
}
