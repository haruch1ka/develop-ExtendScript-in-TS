import { diaryGekkanDayStructure, diaryGekkanPageStructure } from "./diaryGekkanStructure";
import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import Styles from "./Props/Styles";
import diaryInputData from "./diaryInputData";
import { diaryGekkanPageEntity, firstPageEntity } from "./diaryGekkanEntity";

polyfill();

const pages = app.activeDocument.pages;

///////////////////////////
// データの取得
///////////////////////////

//エクセルデータの取得
const diaryData = new diaryInputData().data;

//年を取得して数値に変換
const year = parseInt(diaryData[1][1]);

//カレンダークラスのインスタンス化
const cal = new calendar();

//エクセルの前月のデータを、[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 , 31, 28, 31, 30]のように分ける
const monthEachDataConverted = (inputData: String[][]) => {
	const [from, to] = [
		[inputData[1][1], inputData[1][2]],
		[inputData[inputData.length - 1][1], inputData[inputData.length - 1][2]],
	];
	const cal = new calendar();
	const allMonthDaysLength = [...cal.getMonthDaysLengths(year), ...cal.getMonthDaysLengths(year + 1).slice(0, 4)];
	const allMonthDataArray = []; //月ごとにデータを格納する配列
	let counter = 0;
	for (let i = 0; i < allMonthDaysLength.length; i++) {
		/*@ts-ignore*/
		const monthData = [...inputData.slice(counter + 1, allMonthDaysLength[i] + counter + 1)];
		allMonthDataArray.push(monthData);
		counter += allMonthDaysLength[i];
	}
	return allMonthDataArray;
};
//取得したデータを変換
const getArrangedDataArray = (monthDataArray: String[][][]): diaryGekkanPageStructure[] => {
	const weekNumList: { [key: string]: number } = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
	/*@ts-ignore*/
	const allArangedData = allMonthDataArray.map((month, i): diaryGekkanPageStructure => {
		const monthData = month;
		const firstYoubi = month[0][6];
		const youbiNum = weekNumList[firstYoubi];

		const createMainDayStructureArray = (): diaryGekkanDayStructure[] => {
			const mainDayStructureArray = monthData.map((day: string[]) => {
				const _dayStructure = new diaryGekkanDayStructure(day[3], day[6], day[7], day[2], day[1]);
				if (day[0] === "h") _dayStructure.isHoliday = true;
				if (day[6] === "日") _dayStructure.isSunday = true;
				if (day[6] === "土") _dayStructure.isSaturday = true;
				return _dayStructure;
			});
			return mainDayStructureArray;
		};
		const dayStructureArray = createMainDayStructureArray();

		return new diaryGekkanPageStructure(dayStructureArray);
	});
	return allArangedData;
};
const allMonthDataArray = monthEachDataConverted(diaryData);
const allArangedData = getArrangedDataArray(allMonthDataArray);

// $.writeln(allArangedData);

// for (let i = 0; i < allArangedData.length; i++) {
// 	const diaryGekkanDayStructureArray = allArangedData[i].dayStructureArray;
// 	const yearText = allArangedData[i].yearText;
// 	const monthText = allArangedData[i].monthText;
// 	$.writeln(yearText);
// 	$.writeln(monthText);
// 	$.writeln(diaryGekkanDayStructureArray);
// 	for (let j = 0; j < diaryGekkanDayStructureArray.length; j++) {
// 		$.writeln(
// 			diaryGekkanDayStructureArray[j].dayText +
// 				" : dayText / " +
// 				diaryGekkanDayStructureArray[j].monthText +
// 				" : monthText / " +
// 				diaryGekkanDayStructureArray[j].yearText +
// 				" : yearText / "
// 		);
// 	}
// }

///////////////////////////
// エンティティの定義
///////////////////////////

const _firstPageEntity = new firstPageEntity(pages[0]);
$.writeln(_firstPageEntity.dayStory.contents);
$.writeln(_firstPageEntity.weekStory.contents);
$.writeln(_firstPageEntity.holidayStory.contents);

///////////////////////////
// 処理の開始
///////////////////////////

/*@ts-ignore*/
for (let i = 0; i < pages[0].textFrames.length; i++) {
	const textFrame = pages[0].textFrames[i];
	/*@ts-ignore */
	textFrame.parentStory.characters.everyItem().remove();
}

//テキストの挿入
((arrangedDataArray: diaryGekkanPageStructure[]) => {
	//ページごとにデータを挿入
	for (let i = 3; i < arrangedDataArray.length; i++) {
		//日、週、祝日の文字列を取得
		/*@ts-ignore*/
		const dayString = arrangedDataArray[i].dayStructureArray.map((structure) => structure.dayText).join("\r");
		/*@ts-ignore*/
		const weekString = arrangedDataArray[i].dayStructureArray.map((structure) => structure.weekText).join("\r");
		/*@ts-ignore*/
		const holidayString = arrangedDataArray[i].dayStructureArray.map((structure) => structure.holidayText).join("\r");

		//日、週、祝日の文字列を挿入
		_firstPageEntity.dayStory.insertionPoints[-1].contents = dayString;
		_firstPageEntity.weekStory.insertionPoints[-1].contents = weekString;
		_firstPageEntity.holidayStory.insertionPoints[-1].contents = holidayString;

		if (i !== dayString.length - 1) _firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
		if (i !== weekString.length - 1) _firstPageEntity.weekStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
		if (i !== holidayString.length - 1) _firstPageEntity.holidayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;

		const pageEntity = new diaryGekkanPageEntity(pages[i]);
		// pageEntity.yearTextFrame.contents = arrangedDataArray[i].yearText;
		// pageEntity.monthTextFrame.contents = arrangedDataArray[i].monthText;
	}
})(allArangedData);
