class calendar {
	year: number;
	monthDays: number[];
	constructor(year: number) {
		this.year = year;
		this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 月の日数
		if (this.isLeapYear()) this.monthDays[1] = 29; // うるう年
	}
	isLeapYear(): boolean {
		if (this.year % 400 === 0) return true;
		if (this.year % 100 === 0) return false;
		if (this.year % 4 === 0) return true;
		return false;
	}
	getYoubi(year: number, month: number, day: number): number {
		const d = new Date(year, month - 1, day);
		return d.getDay();
	}
	getMonthText(year: number, month: number) {
		const youbi = this.getYoubi(year, month, 1);
	}
}

export default calendar;
