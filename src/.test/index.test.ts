import { expect, test } from "vitest";
import calendar from "./../calendar";
import diaryHonshiStocker from "./../diaryHonshiStocker";

const year = 2026;
const cal = new calendar();
const _diaryHonshiStocker = new diaryHonshiStocker(); //diaryHonshiStockerクラスのインスタンスを生成する。
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

test("get March gap days", () => {
	const youbiNum = cal.getYoubi(year, 4, 1);
	const gap = youbiToDaysGap[youbiNum];
	const march = cal.getMonthDays(year - 1, 3);
	const marchArray = [...Array(gap)].map((_, i) => march[march.length - (gap - i)]);
	console.log(marchArray);
	expect(march.length).toBe(31);
});

test("createarray ", () => {
	const arrayLength = 3;
	const collectArray = [-3, -2, -1];
	const thisArray = (input: num) => {
		const array = [...Array(input)].map((_, i) => -(input - i));
		return array;
	};
	console.log(thisArray(arrayLength));
	expect(thisArray(arrayLength)).toStrictEqual(collectArray);
});
