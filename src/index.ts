import diaryInputData from "./diaryInputData";
import calendar from "./calendar";
import polyfill from "./polyfill/polyfill";

polyfill();

const diary = new diaryInputData();

const cal = new calendar();
const year = parseInt(diary.data[1][1]);
const youbiToDaysGap: { [key: string]: number } = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日

//曜日に応じて、前年度の日にちを取得する。

const getBeforeGap = (year: number) => {
	const youbiNum = cal.getYoubi(year, 4, 1);
	$.writeln("youbiNum:" + youbiNum);
	const gap: number = youbiToDaysGap[youbiNum];
	return gap;
};

const getAfterGap = (beforePlusYearLength: number) => {
	const input = beforePlusYearLength;
	if (input % 7 !== 0) {
		return (Math.floor(input / 7) + 1) * 7 - input;
	} else {
		return 0;
	}
	throw new Error("error");
};

//要素の数を取得
const beforeGap = getBeforeGap(year);
const yearLength = cal.isLeapYear(year + 1) ? 366 : 365;
const AfterGap = getAfterGap(beforeGap + yearLength);
const monthLength = cal.getMonthLength(1, 3);

//すべてのデータを取得
const beforeData = diary.data.slice(monthLength - beforeGap, monthLength);
const mainData = diary.data.slice(monthLength + 1, monthLength + yearLength + 1);
const afterData = diary.data.slice(monthLength + yearLength + 1, monthLength + yearLength + AfterGap + 1);

/*@ts-ignore*/
const daysText = [...beforeData.map((v) => v[3]), ...mainData.map((v) => v[3]), ...afterData.map((v) => v[3])].join("\n");
$.writeln(daysText);

//入力先のエンティティを取得
