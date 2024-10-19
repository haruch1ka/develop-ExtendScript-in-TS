import { expect, test } from "vitest";
import calendar from "../calendar";

test("isLeapYear", () => {
	// うるう年かどうか
	const cal = new calendar();
	expect(cal.isLeapYear(2020)).toBe(true);
	expect(cal.isLeapYear(2021)).toBe(false);
});

test("getYoubi", () => {
	// 曜日を取得
	const cal = new calendar();
	expect(cal.getYoubi(2020, 2, 1)).toBe(6);
});

test("getMonthDays", () => {
	const cal = new calendar();
	expect(cal.getMonthDays(2025, 2).length).toBe(28);
	expect(cal.getMonthDays(2020, 2).length).toBe(29);
	expect(cal.getMonthDays(2024, 2).length).toBe(29);
});
