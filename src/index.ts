import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import Styles from "./Props/Styles";
import diaryInputData from "./diaryInputData";
import { firstPageEntity } from "./diaryCalenderPageEntity";

//月ごとのテキストデータを生成するクラス
class monthText {
	youbi: number;
	daysTextArray: string[] = [];
	beforeDashArray: string[] = [];
	afterDashArray: string[] = [];
	dividedNumArray: number[] = [];
	constructor(month: number, year: number, cal: calendar) {
		this.youbi = cal.getYoubi(year, month, 1); //数字で曜日を取得
		/*@ts-ignore*/
		if (this.youbi !== 0) [...Array(this.youbi)].map(() => this.beforeDashArray.push("..."));
		if (this.youbi === 0) this.beforeDashArray.push("-1");
		/*@ts-ignore*/
		[...Array(cal.monthDays[month - 1])].map((_, i) => this.daysTextArray.push(String(i + 1)));
		this.swapDate();
	}
	swapDate() {
		const length = this.daysTextArray.length;
		const diff = 35 - (this.youbi + length);
		if (diff > 0) {
			/*@ts-ignore*/
			[...Array(diff)].map(() => this.afterDashArray.push("..."));
			this.dividedNumArray.push(-1);
		} else if (diff < 0) {
			/*@ts-ignore*/
			const diffArray = [...Array(-diff)].map(() => this.daysTextArray.pop());
			diffArray.reverse();
			/*@ts-ignore*/
			diffArray.map((v, i) => {
				const place = 29 - this.youbi + i * 2;
				this.daysTextArray.splice(place, 0, v);
				this.dividedNumArray.push(place);
			});
			this.afterDashArray.push("-1");
		} else {
			this.afterDashArray.push("-1");
			this.dividedNumArray.push(-1);
		}
	}
}
//月ごとのテキストデータをストックするクラス
class stockText {
	beforeTextArray: string[] = [];
	mainTextArray: string[] = [];
	afterTextArray: string[] = [];
	stockText(_monthTextInstance: monthText) {
		const beforeText = this.makeText(_monthTextInstance.beforeDashArray).slice(0, -1); //beforeTextの最後の改行を削除
		const mainText = this.makeText(_monthTextInstance.daysTextArray).slice(0, -1); //mainTextの最後の改行を削除
		const afterText = this.makeTextReverce(_monthTextInstance.afterDashArray); //afterTextの最後の改行を削除
		this.beforeTextArray.push(beforeText);
		this.mainTextArray.push(mainText);
		this.afterTextArray.push(afterText);
	}
	makeText(textArray: string[]): string {
		let text = "";
		for (let i = 0; i < textArray.length; i++) {
			text += textArray[i] + "\r";
		}
		return text;
	}
	makeTextReverce(textArray: string[]): string {
		let text = "";
		for (let i = textArray.length; i < textArray.length; i++) {
			text += "\r" + textArray[i];
		}
		return text;
	}
}
//月ごとのテキストデータの配置場所をストックするクラス
class stockPlace {
	placeArrayArray: number[][] = [];
	stockPlace(_monthTextInstance: monthText) {
		this.placeArrayArray.push(_monthTextInstance.dividedNumArray);
	}
	getPlaceArrayArray() {
		return this.placeArrayArray;
	}
}
//月ごとの日付リストをストックするクラス
class stockDaysList {
	daysListArray: string[][] = [];
	stockDaysList(_monthTextInstance: monthText) {
		this.daysListArray.push(_monthTextInstance.daysTextArray);
	}
}
//月ごとのダッシュテキストをストックするクラス
class stockDashArray {
	beforeDashArray: string[][] = [];
	afterDashArray: string[][] = [];
	stockDashArray(_monthTextInstance: monthText) {
		this.beforeDashArray.push(_monthTextInstance.beforeDashArray);
		this.afterDashArray.push(_monthTextInstance.afterDashArray);
	}
}
//すべてのストックされたデータをまとめるクラス
class calTextData {
	stockText: stockText;
	stockPlace: stockPlace;
	stockDaysList: stockDaysList;
	stockDashArray: stockDashArray;
	constructor(pages: any, year: number) {
		this.stockText = new stockText();
		this.stockPlace = new stockPlace();
		this.stockDaysList = new stockDaysList();
		this.stockDashArray = new stockDashArray();
		for (let j = 0; j < pages.length; j++) {
			const pageIndex = j;
			const tarYear = j > 11 ? year + 1 : year;
			const tarMonth = j > 11 ? j - 11 : j + 1;

			/*月のテキストデータを取得 */
			const _monthText = new monthText(tarMonth, tarYear, new calendar());
			this.stockText.stockText(_monthText);
			this.stockPlace.stockPlace(_monthText);
			this.stockDaysList.stockDaysList(_monthText);
			this.stockDashArray.stockDashArray(_monthText);
		}
	}
}
//ページアイテムをストックするクラス
class pageItemStoker {
	page: any;
	sunNameList: any[] = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
	satNameList: any[] = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];
	allNameList: string[] = [
		"txf1a",
		"txf1b",
		"txf1c",
		"txf1d",
		"txf1e",
		"txf1f",
		"txf1g",
		"txf2a",
		"txf2b",
		"txf2c",
		"txf2d",
		"txf2e",
		"txf2f",
		"txf2g",
		"txf3a",
		"txf3b",
		"txf3c",
		"txf3d",
		"txf3e",
		"txf3f",
		"txf3g",
		"txf4a",
		"txf4b",
		"txf4c",
		"txf4d",
		"txf4e",
		"txf4f",
		"txf4g",
		"txf5a",
		"txf5b",
		"txf5c",
		"txf5d",
		"txf5e",
		"txf5f",
		"txf5g",
	];
	allName: string[] = [];
	constructor(page: any) {
		this.page = page;
	}
	getSunItemList() {
		/*@ts-ignore*/
		return this.getListItems(this.sunNameList);
	}
	getSatItemList() {
		return this.getListItems(this.satNameList);
	}
	getListItems(list: string[]) {
		const itemList = [];
		for (let i = 0; i < list.length; i++) {
			const item = this.page.pageItems.itemByName(list[i]);
			itemList.push(item);
		}
		return itemList;
	}
	getItemByName(name: string) {
		return this.page.pageItems.itemByName(name);
	}
}
//マスターページのアイテムをストックするクラス
class masterPageItem {
	master: any;
	itemNameList: string[] = ["赤円_小", "赤円_大", "スラッシュ_赤小", "スラッシュ_黒小"];
	itemPropertyNameList: string[] = ["sCircle", "lCircle", "rSlash", "bSlash"];
	itemList: any[] = [];
	allName: string[];
	sCircle: any;
	lCircle: any;
	rSlash: any;
	bSlash: any;

	constructor() {
		this.master = app.activeDocument.masterSpreads[0];
		const _pageItemStoker = new pageItemStoker(this.master);
		this.allName = _pageItemStoker.allName;
		/*@ts-ignore*/
		this.itemList = this.itemNameList.map((v) => _pageItemStoker.getItemByName(v).getElements());
		for (let i = 0; i < this.itemList.length; i++) {
			/*@ts-ignore*/
			this[this.itemPropertyNameList[i]] = this.itemList[i];
		}
	}
	getItemByName(name: string) {
		return this.master.pageItems.itemByName(name);
	}
}
polyfill();

const diary = new diaryInputData();
const cal = new calendar();
const grobalYear = parseInt(diary.data[1][1]);

/*@ts-ignore*/
const holidayData = diary.data.map((v) => v[0]);
holidayData.shift();

/*グローバル変数の設定*/

const pages = app.activeDocument.pages;
const calTexts = new calTextData(pages, grobalYear);
const master = new masterPageItem();

//スタイルの定義
const paraStyles = new Styles(app.activeDocument.paragraphStyles);
const charStyles = new Styles(app.activeDocument.characterStyles);

//エンティティの定義
const _firstPageEntity = new firstPageEntity(app.activeDocument.pages[0]);

const createHolidayIndex = (inputDataArray: string[], calTexts: calTextData) => {
	const daysListArray = calTexts.stockDaysList.daysListArray;
	/*@ts-ignore*/
	const sliceByMonthArray = daysListArray.map((_, i) => {
		return inputDataArray.splice(0, daysListArray[i].length);
	});
	/*@ts-ignore*/
	return sliceByMonthArray.map((v, i) => {
		const monthData = v;
		const monthHolidayIndexArray = [];
		for (let j = 0; j < monthData.length; j++) {
			if (monthData[j] === "h") monthHolidayIndexArray.push(j);
		}
		if (monthHolidayIndexArray.length === 0) monthHolidayIndexArray.push(-1);
		return monthHolidayIndexArray;
	});
};
const insertText = (calTexts: calTextData) => {
	_firstPageEntity.dayInsertionPoint.appliedParagraphStyle = paraStyles.getStyle("Calendar_平日");
	for (let i = 0; i < calTexts.stockText.mainTextArray.length; i++) {
		_firstPageEntity.dayStory.insertionPoints[-1].contents = calTexts.stockText.mainTextArray[i];
		_firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
	}
	/*@ts-ignore*/
	_firstPageEntity.dayStory.characters.everyItem().appliedCharacterStyle = charStyles.getStyle("[なし]");
	_firstPageEntity.dayStory.clearOverrides(); //Story上のオーバーライドを一括消去
};
const insertHolidayText = (pages: any, holidayIndex: number[][], master: masterPageItem, calTex: calTextData) => {
	for (let i = 0; i < holidayIndex.length; i++) {
		$.writeln(holidayIndex[i]);
	}
	for (let i = 0; i < holidayIndex.length; i++) {
		const _pageItemStoker = new pageItemStoker(pages[i]);
		const indexArray = holidayIndex[i];
		if (indexArray[0] === -1) continue;
		/*@ts-ignore*/
		const fixedIndexArray = indexArray.map((v) => calTex.stockDaysList.daysListArray[i].indexOf(String(v + 1)));
		/*@ts-ignore*/
		const tf = fixedIndexArray.map((v) => _pageItemStoker.getItemByName(_pageItemStoker.allNameList[v]).getElements());
		for (let j = 0; j < tf.length; j++) {
			tf[j][0].characters.everyItem().appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
			const insertionPoint = tf[j][0].insertionPoints[0];
			const oval = master.lCircle[0].duplicate([0, 0], [0, 0]);
			oval.anchoredObjectSettings.insertAnchoredObject(insertionPoint, AnchorPosition.ANCHORED);
			oval.clearObjectStyleOverrides();
		}
	}
};
/*上下を分けるスタイルの適用*/
const jougeStyle = (calTexts: calTextData) => {
	for (let i = 0; i < calTexts.stockPlace.placeArrayArray.length; i++) {
		const indexArray = calTexts.stockPlace.placeArrayArray[i];
		if (indexArray[0] === -1) continue;
		const page = app.activeDocument.pages[i];
		const _pageItemStoker = new pageItemStoker(page);
		const getItem = (indexArray: number[], _pageItemStoker: pageItemStoker, num1: number) => {
			/*@ts-ignore*/
			const item = [...Array(2)].map((_, i) =>
				_pageItemStoker.getItemByName(_pageItemStoker.allNameList[indexArray[num1] - 1 + i])
			);
			/*@ts-ignore*/
			const tf = item.map((v) => v.getElements());
			return tf;
		};
		const [akaStyleNum, bkStyleNum] = [6, 4];

		if (indexArray.length === 1 || indexArray.length === 2) {
			/*@ts-ignore*/
			getItem(indexArray, _pageItemStoker, 0).map((v, i) => {
				v[0].characters[-3].appliedCharacterStyle = app.activeDocument.characterStyles[i + akaStyleNum];
				v[0].characters[-2].appliedCharacterStyle = app.activeDocument.characterStyles[i + akaStyleNum];
			});
		}
		if (indexArray.length === 2) {
			/*@ts-ignore*/
			getItem(indexArray, _pageItemStoker, 1).map((v, i) => {
				v[0].characters[-3].appliedCharacterStyle = app.activeDocument.characterStyles[i + bkStyleNum];
				v[0].characters[-2].appliedCharacterStyle = app.activeDocument.characterStyles[i + bkStyleNum];
			});
		}
	}
};
const removeBreak = (calTexs: calTextData, master: masterPageItem) => {
	for (let i = 0; i < calTexts.stockPlace.placeArrayArray.length; i++) {
		const indexArray = calTexts.stockPlace.placeArrayArray[i];
		if (indexArray[0] === -1) continue;
		const page = app.activeDocument.pages[i];
		const _pageItemStoker = new pageItemStoker(page);
		if (indexArray.length === 1 || indexArray.length === 2) {
			const tarChars = _pageItemStoker.getItemByName(_pageItemStoker.allNameList[indexArray[0] - 1]).getElements()[0].characters;
			//slashの挿入
			const slash = master.rSlash[0].duplicate([0, 0], [0, 0]);
			slash.anchoredObjectSettings.insertAnchoredObject(tarChars.firstItem().insertionPoints[0], AnchorPosition.ANCHORED);
			slash.clearObjectStyleOverrides();
			tarChars.firstItem().characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付aka");
			//breakの削除
			tarChars.lastItem().remove();
		}
		if (indexArray.length === 2) {
			const tarChars = _pageItemStoker.getItemByName(_pageItemStoker.allNameList[indexArray[1] - 2]).getElements()[0].characters;
			//slashの挿入
			const slash = master.bSlash[0].duplicate([0, 0], [0, 0]);
			slash.anchoredObjectSettings.insertAnchoredObject(tarChars.firstItem().insertionPoints[0], AnchorPosition.ANCHORED);
			slash.clearObjectStyleOverrides();
			tarChars.firstItem().characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付BK");
			//breakの削除
			tarChars.lastItem().remove();
		}
	}
};
const insertDash = (calTexts: calTextData) => {
	const _daysListArray = calTexts.stockDaysList.daysListArray;
	const _stockDashArray = calTexts.stockDashArray;
	for (let i = 0; i < _daysListArray.length; i++) {
		const page = app.activeDocument.pages[i];
		const _pageItemStoker = new pageItemStoker(page);
		if (_stockDashArray.afterDashArray[i][0] !== "-1") {
			const lastItem = _pageItemStoker.allNameList[_daysListArray[i].length - 1];
			const lastItemObj = _pageItemStoker.getItemByName(lastItem).getElements()[0];
			const lastInsertionPoint = lastItemObj.insertionPoints[-2];
			/*@ts-ignore*/
			lastInsertionPoint.appliedCharacterStyle = charStyles.getStyle("黒100");
			let afterText = "";
			for (let j = 0; j < _stockDashArray.afterDashArray[i].length; j++) {
				afterText += "\r" + _stockDashArray.afterDashArray[i][j];
			}
			lastInsertionPoint.contents = afterText;
		}
		if (_stockDashArray.beforeDashArray[i][0] !== "-1") {
			const firstItem = _pageItemStoker.allNameList[0];
			const firstItemObj = _pageItemStoker.getItemByName(firstItem);
			const firstInsertionPoint = firstItemObj.getElements()[0].insertionPoints[0];
			/*@ts-ignore*/
			firstInsertionPoint.appliedCharacterStyle = charStyles.getStyle("黒100");
			let beforeText = "";
			for (let j = 0; j < _stockDashArray.beforeDashArray[i].length; j++) {
				beforeText += _stockDashArray.beforeDashArray[i][j] + "\r";
			}
			firstInsertionPoint.contents = beforeText;
		}
	}
};
/*土日にスタイルを適用*/

const applyParaStyle = (calTexts: calTextData) => {
	const sunNameList = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
	const satNameList = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];

	for (let i = 0; i < calTexts.stockDaysList.daysListArray.length; i++) {
		const page = app.activeDocument.pages[i];
		const _pageItemStoker = new pageItemStoker(page);
		const sunTextFrames = _pageItemStoker.getSunItemList();
		const satTextFrames = _pageItemStoker.getSatItemList();
		const containEllipsis = (test: string) => {
			const regex = new RegExp(/\.\.\./);
			return regex.test(test);
		};
		const getNonDigitOrDotLength = (text: string): number => {
			const regex = new RegExp(/[^0-9]/g);
			const matches = text.match(regex);
			return matches ? matches.length : 0;
		};

		for (let i = 0; i < sunTextFrames.length; i++) {
			const sunEveryItem = sunTextFrames[i].characters.everyItem();
			sunEveryItem.appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
			//上下のスタイルを壊さないために、最初のテキストフレームのみaka100を適用
			if (containEllipsis(sunTextFrames[i].contents)) sunEveryItem.appliedCharacterStyle = charStyles.getStyle("aka100");
		}
		for (let i = 0; i < satTextFrames.length; i++) {
			const satEveryItem = satTextFrames[i].characters.everyItem();
			satEveryItem.appliedParagraphStyle = paraStyles.getStyle("Calendar_土曜");
			if (getNonDigitOrDotLength(satTextFrames[i].contents) > 1) {
				satEveryItem.appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
			}
			if (containEllipsis(satTextFrames[i].contents) && i === 4)
				satEveryItem.appliedCharacterStyle = charStyles.getStyle("aka50");
		}
	}
};

//初期化処理
/*@ts-ignore*/
app.activeDocument.pages[0].textFrames[0].parentStory.characters.everyItem().remove(); //Story上のテキストを一括削除

//データの挿入

//ストーリーに一括挿入
const holidayIndex = createHolidayIndex(holidayData, calTexts);
insertText(calTexts);
if (holidayIndex) insertHolidayText(pages, holidayIndex, master, calTexts);
jougeStyle(calTexts);
removeBreak(calTexts, master);
insertDash(calTexts);
applyParaStyle(calTexts);
