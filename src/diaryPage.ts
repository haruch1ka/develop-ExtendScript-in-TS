class diaryPage {
	month: number;
	year: number;
	dayList: number[];
	constructor(month: number, year: number, dayList: number[]) {
		this.month = month;
		this.year = year;
		this.dayList = dayList;
	}
}

class Input {
	rokuyou: string[];
	holidays: string[];
	constructor(rokuyou: string[], holidays: string[]) {
		this.rokuyou = rokuyou;
		this.holidays = holidays;
	}
}
