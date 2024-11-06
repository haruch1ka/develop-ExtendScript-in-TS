import diaryInputData from "./diaryInputData";
import calendar from "./calendar";
import polyfill from "./polyfill/polyfill";
import { diaryPageEntity, firstPageEntity } from "./diaryPageEntity";
import { diaryPageStructure, diaryDayStructure } from "./diaryPageStructure";
import myMasterPageItem from "./Props/myMasterItem";
import { formatText, changeCharacterStyle, changeParagraphStyle } from "./Props/TextFrameWrapper";
import Styles from "./Props/Styles";

polyfill();

const diary = new diaryInputData();

const cal = new calendar();
const year = parseInt(diary.data[1][1]);
const youbiToDaysGap: { [key: string]: number } = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日

//曜日に応じて、穴埋めで入る前年度の日にちを取得する。

const getBeforeGap = (year: number) => {
	const youbiNum = cal.getYoubi(year, 4, 1);
	const gap: number = youbiToDaysGap[youbiNum];
	return gap;
};
//前年度と今年度の日数から、穴埋めで入る来年度の日数を取得する。
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
//1月から3月までの日数を取得
const monthLength = cal.getMonthLength(1, 3, year);

//すべてのデータを取得(2行目からなのでindexは常に+1)
const beforeData = diary.data.slice(monthLength - beforeGap + 1, monthLength + 1);
const mainData = diary.data.slice(monthLength + 1, monthLength + yearLength + 1);
const afterData = diary.data.slice(monthLength + yearLength + 1, monthLength + yearLength + AfterGap + 1);

/*@ts-ignore*/
const daysText = [...beforeData.map((v) => v[3]), ...mainData.map((v) => v[3]), ...afterData.map((v) => v[3])].join("\r");
/*@ts-ignore*/
const rokuyouText = [...beforeData.map((v) => v[8]), ...mainData.map((v) => v[8]), ...afterData.map((v) => v[8])].join("\r");
/*@ts-ignore*/
const holidayText = [...beforeData.map((v) => v[7]), ...mainData.map((v) => v[7]), ...afterData.map((v) => v[7])].join("\r");

//入力先のエンティティを取得

const _firstPageEntity = new firstPageEntity(app.activeDocument.pages[11]);

const _masterItem = new myMasterPageItem(2);

_firstPageEntity.dayStory.contents = daysText;
_firstPageEntity.rokuyouStory.contents = rokuyouText;
_firstPageEntity.holidayStory.contents = holidayText;

//流し込むデータの構造を作成

//前年度、今年度、来年度のデータ構造をそれぞれ作成
/*@ts-ignore*/
const _diaryDayStructureBefore = beforeData.map((v) => {
	const _instance = new diaryDayStructure(v);
	_instance.setGlayActivate();
	return _instance;
});
/*@ts-ignore*/
const _diaryDayStructureMain = mainData.map((v) => {
	return new diaryDayStructure(v);
});
/*@ts-ignore*/
const _diaryDayStructureAfter = afterData.map((v) => {
	const _instance = new diaryDayStructure(v);
	_instance.setGlayActivate();
	return _instance;
});

//すべてのデータを結合した後、ページごとに分割する
const allDayStructure = [..._diaryDayStructureBefore, ..._diaryDayStructureMain, ..._diaryDayStructureAfter];
$.writeln(allDayStructure.length);

const allPageStructure = (function (array) {
	const length = Math.ceil(array.length / 7);
	/*@ts-ignore*/
	const res = [...Array(length)].map((_, i) => {
		const _pageItem = array.slice(i * 7, i * 7 + 7);
		const _daiaryPageStructure = new diaryPageStructure(_pageItem);
		return _daiaryPageStructure;
	});
	return res;
})(allDayStructure);

//肩の数字の複製を作成
for (let i = 0; i < allPageStructure.length; i++) {
	const diff = 11;
	const page = app.activeDocument.pages[i * 2 + diff];
	const duplicatedSengetsu = (function (masterPageItem: myMasterPageItem, to: Page) {
		const textFrame = masterPageItem.getTextFrame("sengetsu", to);
		return formatText(textFrame);
	})(_masterItem, page);
	/*@ts-ignore*/
	duplicatedSengetsu.move([2.58, 40.5], undefined);
}

//スタイルを取得
const characterStyles = new Styles(app.activeDocument.characterStyles);
const paragraphStyles = new Styles(app.activeDocument.paragraphStyles);
const p_style_left_up = paragraphStyles.getStyle("日毎予定表_左肩数字");
const c_style_glay = characterStyles.getStyle("Black30");
const c_style_sat = characterStyles.getStyle("aka50");
const c_style_sun = characterStyles.getStyle("aka100");

$.writeln(p_style_left_up.name);

//それぞれのページに流し込む/スタイルを適用する
for (let i = 0; i < allPageStructure.length; i++) {
	const diff = 11;
	const page = app.activeDocument.pages[i * 2 + diff];
	const pageStructure = allPageStructure[i];
	const pageEntity = new diaryPageEntity(page);

	pageEntity.monthTextFrame.contents = pageStructure.monthText;
	pageEntity.monthEnglishTextFrame.contents = pageStructure.monthEnglishText;
	pageEntity.sengetsuTextFrame.contents = pageStructure.sengetsuText;
	changeParagraphStyle(pageEntity.sengetsuTextFrame, p_style_left_up);
	if (pageStructure.sengetsuText !== "" && pageStructure.dayStructureArray[0].isGlay) {
		changeCharacterStyle(pageEntity.sengetsuTextFrame, c_style_glay);
	}
	//スタイルを条件に応じて適用する
	/*@ts-ignore*/
	pageEntity.dayEntityList.map((v, j) => {
		const dayStructure = pageStructure.dayStructureArray[j];
		const isHoliday = dayStructure.holidayText !== "";
		if (dayStructure.isGlay) {
			changeCharacterStyle(v.dayTextFrame, c_style_glay);
			changeCharacterStyle(v.weekTextFrame, c_style_glay);
			changeCharacterStyle(v.rokuyouTextFrame, c_style_glay);
		} else {
			if (dayStructure.youbiText === "土") {
				changeCharacterStyle(v.weekTextFrame, c_style_sat);
				if (!isHoliday) {
					changeCharacterStyle(v.dayTextFrame, c_style_sat);
				} else {
					changeCharacterStyle(v.dayTextFrame, c_style_sun);
				}
			} else if (dayStructure.youbiText === "日") {
				changeCharacterStyle(v.weekTextFrame, c_style_sun);
				changeCharacterStyle(v.dayTextFrame, c_style_sun);
			} else {
				if (isHoliday) {
					changeCharacterStyle(v.dayTextFrame, c_style_sun);
				}
			}
		}
	});
}
