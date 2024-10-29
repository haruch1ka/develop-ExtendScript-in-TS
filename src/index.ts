import { diaryCalenderPageStructure, diaryCalenderDayStructure } from "./diaryCalenderPageStructure";
import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import Styles from "./Props/Styles";
import diaryInputData from "./diaryInputData";
import { firstPageEntity, diaryCalenderPageEntity } from "./diaryCalenderPageEntity";
polyfill();
//マスターページのアイテムをストックするクラス
class masterPageItem {
	master: any;
	itemNameList: string[] = ["赤円_小", "赤円_大", "スラッシュ_赤小", "スラッシュ_黒小"];
	itemPropertyNameList: string[] = ["sCircle", "lCircle", "rSlash", "bSlash"];
	itemList: any[] = [];
	sCircle: any;
	lCircle: any;
	rSlash: any;
	bSlash: any;
	constructor() {
		this.master = app.activeDocument.masterSpreads[0];
		/*@ts-ignore*/
		this.itemList = this.itemNameList.map((name) => this.master.pageItems.itemByName(name).getElements());
		for (let i = 0; i < this.itemList.length; i++) {
			/*@ts-ignore*/
			this[this.itemPropertyNameList[i]] = this.itemList[i];
		}
	}
}
const pages = app.activeDocument.pages;

////////////////////////////////////////
//	データの取得
////////////////////////////////////////

//エクセルから入手下データ
const diary = new diaryInputData();
//カレンダークラスのインスタンス
const cal = new calendar();
//年の取得
const grobalYear = parseInt(diary.data[1][1]);

////////////////////////////////////////
// データの整形
////////////////////////////////////////

//データ変換関数
const getArrangedDataArray = (inputData: String[][]) => {
	const [from, to] = [
		[inputData[1][1], inputData[1][2]],
		[inputData[inputData.length - 1][1], inputData[inputData.length - 1][2]],
	];
	const cal = new calendar();
	const weekNumList: { [key: string]: number } = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
	const allMonthDaysLength = [...cal.getMonthDaysLengths(grobalYear), ...cal.getMonthDaysLengths(grobalYear + 1).slice(0, 4)];
	// $.writeln(allMonthDaysLength);

	const allMonthDataArray = []; //月ごとにデータを格納する配列
	let counter = 0;
	for (let i = 0; i < allMonthDaysLength.length; i++) {
		/*@ts-ignore*/
		const monthData = [...inputData.slice(counter + 1, allMonthDaysLength[i] + counter + 1)];
		allMonthDataArray.push(monthData);
		counter += allMonthDaysLength[i];
	}
	//
	//
	/*@ts-ignore*/
	const allArangedData = allMonthDataArray.map((month, i): diaryCalenderDayStructure[] => {
		const monthData = month;
		const firstYoubi = month[0][6];
		const youbiNum = weekNumList[firstYoubi];
		// $.writeln(youbiNum);
		const createBeforeDayStructureArray = (): diaryCalenderDayStructure[] => {
			const beforeGap = youbiNum;
			/*@ts-ignore*/
			const beforeDayStructureArray = [...Array(beforeGap)].map(() => {
				const dot = new diaryCalenderDayStructure("...");
				dot.isDot = true;
				return dot;
			});
			if (beforeDayStructureArray.length > 0) beforeDayStructureArray[0].isSunday = true;
			return beforeDayStructureArray;
		};
		const beforeDayStructureArray: diaryCalenderDayStructure[] = createBeforeDayStructureArray();
		const createMainDayStructureArray = (): diaryCalenderDayStructure[] => {
			const mainDayStructureArray = monthData.map((day: string[]) => {
				const _dayStructure = new diaryCalenderDayStructure(day[3]);
				if (day[0] === "h") _dayStructure.isHoliday = true;
				if (day[6] === "日") _dayStructure.isSunday = true;
				if (day[6] === "土") _dayStructure.isSaturday = true;
				return _dayStructure;
			});
			return mainDayStructureArray;
		};
		const mainDayStructureArray: diaryCalenderDayStructure[] = createMainDayStructureArray();

		const createAfterStructureArray = () => {
			/*@ts-ignore*/
			const afterDayStructureArray = [...Array(afterGap)].map(() => {
				const dot = new diaryCalenderDayStructure("...");
				dot.isDot = true;
				return dot;
			});
			if (afterDayStructureArray.length > 0) afterDayStructureArray[afterDayStructureArray.length - 1].isSaturday = true;
			return afterDayStructureArray;
		};
		const afterGap = 35 - (youbiNum + monthData.length);
		const afterDayStructureArray = afterGap > 0 ? createAfterStructureArray() : [];

		if (afterGap < 0) {
			((gap: number) => {
				/*@ts-ignore*/
				const diffArray = [...Array(-gap)].map(() => mainDayStructureArray.pop());
				diffArray.reverse();
				for (let i = 0; i < diffArray.length; i++) {
					const place = 28 - youbiNum + i;
					mainDayStructureArray[place].afterText = diffArray[i].dayText;
					mainDayStructureArray[place].isSeparated = true;
					if (diffArray[i].isHoliday) {
						mainDayStructureArray[place].isRightHoliday = true;
					}
					if (mainDayStructureArray[place].isHoliday) {
						mainDayStructureArray[place].isLeftHoliday = true;
					}
				}
			})(afterGap);
		}
		return [...beforeDayStructureArray, ...mainDayStructureArray, ...afterDayStructureArray];
	});
	return allArangedData;
};
//変換されたデータ
const arrangedDataArray = getArrangedDataArray(diary.data);

////////////////////////////////////////
//	エンティティの定義
////////////////////////////////////////

//エンティティの定義
const _firstPageEntity = new firstPageEntity(app.activeDocument.pages[0]);
/*@ts-ignore*/
const allCalenderPageEntity = [...Array(app.activeDocument.pages.length)].map((_, i) => {
	const page = pages[i];
	return new diaryCalenderPageEntity(page);
});

//マスターページのアイテムをストック
const master = new masterPageItem();
//スタイルの定義
const paraStyles = new Styles(app.activeDocument.paragraphStyles);
const charStyles = new Styles(app.activeDocument.characterStyles);

////////////////////////////////////////
//処理の開始
////////////////////////////////////////

//初期化処理
/* @ts-ignore */
pages[0].textFrames[0].parentStory.characters.everyItem().remove();

//テキストの挿入
((arrangedDataArray: string[][]) => {
	/*@ts-ignore*/
	const dayString = arrangedDataArray.map((v) => v.map((v) => v.dayText).join("\r"));
	_firstPageEntity.dayInsertionPoint.appliedParagraphStyle = paraStyles.getStyle("Calendar_平日");
	for (let i = 0; i < dayString.length; i++) {
		_firstPageEntity.dayStory.insertionPoints[-1].contents = dayString[i];
		if (i !== dayString.length - 1) _firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
	}
	/*@ts-ignore*/
	_firstPageEntity.dayStory.characters.everyItem().appliedCharacterStyle = charStyles.getStyle("[なし]");
	_firstPageEntity.dayStory.clearOverrides(); //Story上のオーバーライドを一括消去
})(arrangedDataArray);
const pageItemNames = [
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
//スタイルの適用
((arrangedDataArray) => {
	for (let i = 0; i < app.activeDocument.pages.length; i++) {
		const page = app.activeDocument.pages[i];
		const pageEntity = new diaryCalenderPageEntity(page);
		const pageStructure = arrangedDataArray[i];

		// $.writeln(`page ${i + 1}`);
		for (let i = 0; i < pageStructure.length; i++) {
			const tf = pageEntity.getByName(pageItemNames[i]);

			if (pageStructure[i].isSeparated) {
				if (pageStructure[i].isSunday || pageStructure[i].isHoliday) {
					tf.characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付aka");
					tf.characters[1].appliedCharacterStyle = charStyles.getStyle("小数字_上付aka");
					const slash = master.rSlash[0].duplicate([0, 0], [0, 0]);
					slash.anchoredObjectSettings.insertAnchoredObject(tf.insertionPoints[-2], AnchorPosition.ANCHORED);
					slash.clearObjectStyleOverrides();
					tf.insertionPoints[-2].contents = pageStructure[i].afterText;
					tf.characters[-2].appliedCharacterStyle = charStyles.getStyle("小数字_下付aka");
					tf.characters[-3].appliedCharacterStyle = charStyles.getStyle("小数字_下付aka");
					if (pageStructure[i].isLeftHoliday) {
						$.writeln("left holiday");
						const circleInsertionPoint = tf.insertionPoints[0];
						const circleSmall = master.sCircle[0].duplicate([0, 0], [0, 0]);
						circleSmall.anchoredObjectSettings.insertAnchoredObject(circleInsertionPoint, AnchorPosition.ANCHORED);
						circleSmall.clearObjectStyleOverrides();
					}
					if (pageStructure[i].isRightHoliday) {
						$.writeln("right holiday");
						const circleInsertionPoint = tf.insertionPoints[-4];
						const circleSmall = master.sCircle[0].duplicate([0, 0], [0, 0]);
						circleSmall.anchoredObjectSettings.insertAnchoredObject(circleInsertionPoint, AnchorPosition.ANCHORED);
						circleSmall.clearObjectStyleOverrides();
					}
				} else {
					tf.characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付BK");
					tf.characters[1].appliedCharacterStyle = charStyles.getStyle("小数字_上付BK");
					const slash = master.bSlash[0].duplicate([0, 0], [0, 0]);
					slash.anchoredObjectSettings.insertAnchoredObject(tf.insertionPoints[-2], AnchorPosition.ANCHORED);
					slash.clearObjectStyleOverrides();
					tf.insertionPoints[-2].contents = pageStructure[i].afterText;
					tf.characters[-2].appliedCharacterStyle = charStyles.getStyle("小数字_下付BK");
					tf.characters[-3].appliedCharacterStyle = charStyles.getStyle("小数字_下付BK");
				}
			} else {
				if (pageStructure[i].isHoliday) {
					const insertionPoint = tf.insertionPoints[0];
					const oval = master.lCircle[0].duplicate([0, 0], [0, 0]);
					oval.anchoredObjectSettings.insertAnchoredObject(insertionPoint, AnchorPosition.ANCHORED);
					oval.clearObjectStyleOverrides();
				}
				if (pageStructure[i].isHoliday || pageStructure[i].isSunday) {
					/*@ts-ignore*/
					tf.characters.everyItem().appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
					// $.writeln(tf.contents + " is holiday");
				} else if (pageStructure[i].isSaturday) {
					/*@ts-ignore*/
					tf.characters.everyItem().appliedParagraphStyle = paraStyles.getStyle("Calendar_土曜");
					// $.writeln(tf.contents + " is saturday");
				}
			}
		}
		$.writeln("------------");
	}
})(arrangedDataArray);
