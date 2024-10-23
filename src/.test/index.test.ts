import { expect, test } from "vitest";
import calendar from "./../calendar";

const year = 2025;
const cal = new calendar();

const youbiToDaysGap: { [key: string]: number } = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日

test("days gap", () => {
	//年度初めの曜日の数字を取得する。
	const youbi = cal.getYoubi(year, 4, 1);
	expect(youbiToDaysGap[1]).toBe(0);
	expect(youbiToDaysGap[2]).toBe(1);
	expect(youbiToDaysGap[3]).toBe(2);
	expect(youbiToDaysGap[4]).toBe(3);
	expect(youbiToDaysGap[5]).toBe(4);
	expect(youbiToDaysGap[6]).toBe(5);
	expect(youbiToDaysGap[0]).toBe(6);
});

test("createarray ", () => {
	const arrayLength = 3;
	const collectArray = [-3, -2, -1];
	const thisArray = (input: num) => {
		const array = [...Array(input)].map((_, i) => -(input - i));
		return array;
	};
	expect(thisArray(arrayLength)).toStrictEqual(collectArray);
});

test("createarray ", () => {
	const calAfterGap = (input: number) => {
		if (input % 7 !== 0) {
			return (Math.floor(input / 7) + 1) * 7 - input;
		} else {
			return 0;
		}
	};
	expect(calAfterGap(7)).toBe(0);
	expect(calAfterGap(8)).toBe(6);
	expect(calAfterGap(9)).toBe(5);
	expect(calAfterGap(10)).toBe(4);
	expect(calAfterGap(11)).toBe(3);
	expect(calAfterGap(12)).toBe(2);
	expect(calAfterGap(13)).toBe(1);
	expect(calAfterGap(14)).toBe(0);
	expect(calAfterGap(15)).toBe(6);
});
test("getBeforeGap", () => {
	const getBeforeGap = (year: number) => {
		const youbiNum = cal.getYoubi(year, 4, 1);
		const gap: number = youbiToDaysGap[youbiNum];
		return gap;
	};
});
test("getAfterGap", () => {
	const getAfterGap = () => {
		const youbiNum = cal.getYoubi(year, 3, 1);
		const gap: number = youbiToDaysGap[youbiNum];

		const getAfterGap = (beforePlusYearLength: number) => {
			const input = beforePlusYearLength;
			if (input % 7 !== 0) {
				return (Math.floor(input / 7) + 1) * 7 - input;
			} else {
				return 0;
			}
			throw new Error("error");
		};
	};
});

test("doAfterGap", () => {
	const getBeforeGap = () => {
		const youbiNum = cal.getYoubi(year, 4, 1);
		const gap: number = youbiToDaysGap[youbiNum];
		return gap;
	};
	const getAfterGap = (input: number) => {
		if (input % 7 !== 0) {
			return (Math.floor(input / 7) + 1) * 7 - input;
		} else {
			return 0;
		}
		throw new Error("error");
	};

	const beforeGap = getBeforeGap();
	const yearLength = cal.isLeapYear(year + 1) ? 366 : 365;
	const AfterGap = getAfterGap(beforeGap + yearLength);
});

test("getMonthLength", () => {
	const monthLength = cal.getMonthLength(1, 3);
	const reslength = 31 + (cal.isLeapYear(year) ? 29 : 28) + 31;
	expect(monthLength).toBe(reslength);
});
