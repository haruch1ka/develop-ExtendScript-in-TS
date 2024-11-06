import { diaryGekkanDayStructure, diaryGekkanPageStructure, getTextframeIndex } from "./diaryGekkanStructure";
import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import Styles from "./Props/Styles";
import { formatText, changeCharacterStyle, changeParagraphStyle } from "./Props/TextFrameWrapper";
import diaryInputData from "./diaryInputData";
import { diaryGekkanEvenPageEntity, diaryGekkanOddPageEntity, firstPageEntity } from "./diaryGekkanEntity";

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

///////////////////////////
// エンティティの定義
///////////////////////////

const _firstPageEntity = new firstPageEntity(pages[0]);
//スタイルの定義
const paraStyles = new Styles(app.activeDocument.paragraphStyles);
const charStyles = new Styles(app.activeDocument.characterStyles);
// const holidayCharStyle = charStyles.itemByName("");

///////////////////////////
// 処理の開始
///////////////////////////

/*@ts-ignore*/
for (let i = 0; i < pages[0].textFrames.length; i++) {
	const textFrame = pages[0].textFrames[i];
	/*@ts-ignore */
	textFrame.parentStory.characters.everyItem().remove();
}
//format all
// for (let j = 0; j < pages.length; j++) {
// 	for (let i = 0; i < pages[j].textFrames.length; i++) {
// 		const textFrame = pages[j].textFrames[i];
// 		/*@ts-ignore */
// 		textFrame.parentStory.characters.everyItem().remove();
// 	}
// }

//ストーリーへテキストの挿入
((arrangedDataArray: diaryGekkanPageStructure[]) => {
	//indexが3以上のデータを取得
	const targetArray = arrangedDataArray.slice(3);
	//ページごとにデータを挿入
	for (let i = 0; i < targetArray.length; i++) {
		//日、週、祝日の文字列を取得
		/*@ts-ignore*/
		const dayString = targetArray[i].dayStructureArray.map((structure) => structure.dayText).join("\r");
		/*@ts-ignore*/
		const weekString = targetArray[i].dayStructureArray.map((structure) => structure.weekText).join("\r");
		/*@ts-ignore*/
		const holidayString = targetArray[i].dayStructureArray.map((structure) => structure.holidayText).join("\r");

		//日、週、祝日の文字列を挿入
		_firstPageEntity.dayStory.insertionPoints[-1].contents = dayString;
		_firstPageEntity.weekStory.insertionPoints[-1].contents = weekString;
		_firstPageEntity.holidayStory.insertionPoints[-1].contents = holidayString;

		if (i !== dayString.length - 1) _firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
		if (i !== weekString.length - 1) _firstPageEntity.weekStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
		if (i !== holidayString.length - 1) _firstPageEntity.holidayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
	}
})(allArangedData);

// ページごとにテキストを挿入
((arrangedDataArray: diaryGekkanPageStructure[]) => {
	//indexが3以上のデータを取得
	const targetArray = arrangedDataArray.slice(3);
	//ページごとにデータを挿入
	for (let i = 0; i < app.activeDocument.pages.length / 2; i++) {
		const even = i * 2;
		const odd = i * 2 + 1;
		const evenPageEntity = new diaryGekkanEvenPageEntity(pages[even]); // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18...
		const oddPageEntity = new diaryGekkanOddPageEntity(pages[odd]); // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19...

		//偶数(0, 2, 4, 6, 8, 10, 12, 14, 16, 18...)ページに月の文字列を挿入
		//奇数(1, 3, 5, 7, 9, 11, 13, 15, 17, 19...)ページに年の文字列を挿入
		evenPageEntity.monthTextFrame.contents = targetArray[i].monthText;
		oddPageEntity.yearTextFrame.contents = targetArray[i].yearText;
	}
})(allArangedData);

// ページごとにスタイルを適用
((arrangedDataArray: diaryGekkanPageStructure[]) => {
	//indexが3以上のデータを取得(4月以降のデータ)
	const targetArray = arrangedDataArray.slice(3);
	for (let i = 0; i < app.activeDocument.pages.length / 2; i++) {
		//左ページと右ページのインデックスを取得
		const even = i * 2;
		const odd = i * 2 + 1;
		//左ページのエンティティを取得
		const evenPageEntity = new diaryGekkanEvenPageEntity(pages[even]); // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18...
		//右ページのエンティティを取得
		const oddPageEntity = new diaryGekkanOddPageEntity(pages[odd]); // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19...

		const leftDayTextFrame = evenPageEntity.dayTextFrame;
		const rightDayTextFrame = oddPageEntity.dayTextFrame;
		//左ページの土曜日の文字にスタイルを適用
		for (let j = 0; j < targetArray[i].leftPageSaturdayArray.length; j++) {
			const index = targetArray[i].leftPageSaturdayArray[j];
			if (index) {
				const charIndex = getTextframeIndex(0, 15, j)[0];
				const charLength = getTextframeIndex(0, 15, j)[1];
				for (let k = charIndex; k > charIndex - charLength; k--) {
					$.writeln(leftDayTextFrame.characters[k].contents);
					leftDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka50");
				}
			}
		}
		//右ページの土曜日の文字にスタイルを適用
		for (let j = 0; j < targetArray[i].rightPageSaturdayArray.length; j++) {
			const index = targetArray[i].rightPageSaturdayArray[j];
			if (index) {
				const charIndex = getTextframeIndex(16, 30, j)[0];
				const charLength = getTextframeIndex(16, 30, j)[1];
				for (let k = charIndex; k > charIndex - charLength; k--) {
					$.writeln(rightDayTextFrame.characters[k].contents);
					rightDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka50");
				}
			}
		}
		//左ページの日曜日、祝日の文字にスタイルを適用
		for (let j = 0; j < targetArray[i].leftPageHolidayArray.length; j++) {
			const index = targetArray[i].leftPageHolidayArray[j];
			if (index) {
				const charIndex = getTextframeIndex(0, 15, j)[0];
				const charLength = getTextframeIndex(0, 15, j)[1];
				for (let k = charIndex; k > charIndex - charLength; k--) {
					$.writeln(leftDayTextFrame.characters[k].contents);
					leftDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka100");
				}
			}
		}
		//右ページの日曜日、祝日の文字にスタイルを適用
		for (let j = 0; j < targetArray[i].rightPageHolidayArray.length; j++) {
			const index = targetArray[i].rightPageHolidayArray[j];
			if (index) {
				const charIndex = getTextframeIndex(16, 30, j)[0];
				const charLength = getTextframeIndex(16, 30, j)[1];
				for (let k = charIndex; k > charIndex - charLength; k--) {
					$.writeln(rightDayTextFrame.characters[k].contents);
					rightDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka100");
				}
			}
		}
	}
})(allArangedData);
