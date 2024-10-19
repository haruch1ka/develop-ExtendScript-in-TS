class calendar {
	monthDays: number[];
	constructor() {
		this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 月の日数
	}
	isLeapYear(year: number): boolean {
		if (year % 400 === 0) return true;
		if (year % 100 === 0) return false;
		if (year % 4 === 0) return true;
		return false;
	}
	changeLeapYear(year: number): void {
		if (this.isLeapYear(year)) this.monthDays[1] = 29; // うるう年
	}
	getYoubi(year: number, month: number, day: number): number {
		this.changeLeapYear(year);
		const d = new Date(year, month - 1, day);
		return d.getDay();
	}
	getMonthDays(year: number, month: number): number[] {
		this.changeLeapYear(year);
		/*@ts-ignore*/
		return [...Array(this.monthDays[month - 1])].map((_, i) => i + 1);
	}
}

export default calendar;
