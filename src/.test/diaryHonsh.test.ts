import { expect, test } from "vitest";
import calendar from "../calendar";
import monthText from "../.diary/diaryHonshi";

test("getMonthText", () => {
	// 月のテキストを取得
	const month = 4;
	const year = 2025;
	const _monthText = new monthText(month, year, new calendar(year));
	const youbi = ["日", "月", "火", "水", "木", "金", "土"];
	console.log(youbi[_monthText.youbi]);
	console.log(_monthText.daysTextArray.length % 7);
	console.log(_monthText.daysTextArray.length);

	//

	expect(_monthText.daysTextArray.length).toBe(new calendar(year).monthDays[month - 1]);
});
