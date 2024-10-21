import calendar from "./calendar";
import polyfill from "./polyfill/polyfill";
import diaryHonshiStocker from "./diaryHonshiStocker";
polyfill();

const year = 2026;
const cal = new calendar();
const _diaryDataStocker = new diaryHonshiStocker(); //diaryHonshiStockerクラスのインスタンスを生成する。
const youbiToDaysGap: { [key: string]: number } = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日

//1~12月までの日にちを取得して、diaryHonshiStockerクラスのインスタンスに格納する。
for (let i = 0; i < cal.monthDays.length; i++) {
	/*@ts-ignore*/
	const monthArray = cal.getMonthDays(year, i + 1).map((v) => v.toString());
	_diaryDataStocker.stock(monthArray);
}

//曜日に応じて、前年度の日にちを取得する。
const createMarchArray = () => {
	const youbiNum = cal.getYoubi(year, 4, 1);
	const gap: number = youbiToDaysGap[youbiNum];
	const march = cal.getMonthDays(year - 1, 3);

	$.writeln(youbiNum);
	$.writeln(gap);
	$.writeln(march);

	/*@ts-ignore*/
	const marchArray = [...Array(gap)].map((_, i) => march[march.length - (gap - i)]);
	return marchArray;
};

// 3月　 + それ以降の日にちを結合する。
