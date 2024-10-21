import { expect, test } from "vitest";
import calendar from "../calendar";
import diaryHonshiStocker from "../diaryHonshiStocker";

test("cal_length", () => {
	let counter = 0;
	const year = 2025;
	const _diaryHonshiStocker = new diaryHonshiStocker();
	const cal = new calendar();
	for (let i = 0; i < cal.monthDays.length; i++) {
		counter += cal.getMonthDays(year, i + 1).length;
		_diaryHonshiStocker.stock(cal.getMonthDays(year, i + 1));
	}
	console.log(_diaryHonshiStocker.get());
	expect(counter).toBe(_diaryHonshiStocker.get().length);
});
