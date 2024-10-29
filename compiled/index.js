var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { diaryCalenderDayStructure } from "./diaryCalenderPageStructure";
import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import Styles from "./Props/Styles";
import diaryInputData from "./diaryInputData";
import { firstPageEntity, diaryCalenderPageEntity } from "./diaryCalenderPageEntity";
polyfill();
//マスターページのアイテムをストックするクラス
var masterPageItem = /** @class */ (function () {
    function masterPageItem() {
        var _this = this;
        this.itemNameList = ["赤円_小", "赤円_大", "スラッシュ_赤小", "スラッシュ_黒小"];
        this.itemPropertyNameList = ["sCircle", "lCircle", "rSlash", "bSlash"];
        this.itemList = [];
        this.master = app.activeDocument.masterSpreads[0];
        /*@ts-ignore*/
        this.itemList = this.itemNameList.map(function (name) { return _this.master.pageItems.itemByName(name).getElements(); });
        for (var i = 0; i < this.itemList.length; i++) {
            /*@ts-ignore*/
            this[this.itemPropertyNameList[i]] = this.itemList[i];
        }
    }
    return masterPageItem;
}());
var pages = app.activeDocument.pages;
////////////////////////////////////////
//	データの取得
////////////////////////////////////////
//エクセルから入手下データ
var diary = new diaryInputData();
//カレンダークラスのインスタンス
var cal = new calendar();
//年の取得
var grobalYear = parseInt(diary.data[1][1]);
////////////////////////////////////////
// データの整形
////////////////////////////////////////
//データ変換関数
var getArrangedDataArray = function (inputData) {
    var _a = [
        [inputData[1][1], inputData[1][2]],
        [inputData[inputData.length - 1][1], inputData[inputData.length - 1][2]],
    ], from = _a[0], to = _a[1];
    var cal = new calendar();
    var weekNumList = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
    var allMonthDaysLength = __spreadArray(__spreadArray([], cal.getMonthDaysLengths(grobalYear), true), cal.getMonthDaysLengths(grobalYear + 1).slice(0, 4), true);
    // $.writeln(allMonthDaysLength);
    var allMonthDataArray = []; //月ごとにデータを格納する配列
    var counter = 0;
    for (var i = 0; i < allMonthDaysLength.length; i++) {
        /*@ts-ignore*/
        var monthData = __spreadArray([], inputData.slice(counter + 1, allMonthDaysLength[i] + counter + 1), true);
        allMonthDataArray.push(monthData);
        counter += allMonthDaysLength[i];
    }
    //
    //
    /*@ts-ignore*/
    var allArangedData = allMonthDataArray.map(function (month, i) {
        var monthData = month;
        var firstYoubi = month[0][6];
        var youbiNum = weekNumList[firstYoubi];
        // $.writeln(youbiNum);
        var createBeforeDayStructureArray = function () {
            var beforeGap = youbiNum;
            /*@ts-ignore*/
            var beforeDayStructureArray = __spreadArray([], Array(beforeGap), true).map(function () {
                var dot = new diaryCalenderDayStructure("...");
                dot.isDot = true;
                return dot;
            });
            if (beforeDayStructureArray.length > 0)
                beforeDayStructureArray[0].isSunday = true;
            return beforeDayStructureArray;
        };
        var beforeDayStructureArray = createBeforeDayStructureArray();
        var createMainDayStructureArray = function () {
            var mainDayStructureArray = monthData.map(function (day) {
                var _dayStructure = new diaryCalenderDayStructure(day[3]);
                if (day[0] === "h")
                    _dayStructure.isHoliday = true;
                if (day[6] === "日")
                    _dayStructure.isSunday = true;
                if (day[6] === "土")
                    _dayStructure.isSaturday = true;
                return _dayStructure;
            });
            return mainDayStructureArray;
        };
        var mainDayStructureArray = createMainDayStructureArray();
        var createAfterStructureArray = function () {
            /*@ts-ignore*/
            var afterDayStructureArray = __spreadArray([], Array(afterGap), true).map(function () {
                var dot = new diaryCalenderDayStructure("...");
                dot.isDot = true;
                return dot;
            });
            if (afterDayStructureArray.length > 0)
                afterDayStructureArray[afterDayStructureArray.length - 1].isSaturday = true;
            return afterDayStructureArray;
        };
        var afterGap = 35 - (youbiNum + monthData.length);
        var afterDayStructureArray = afterGap > 0 ? createAfterStructureArray() : [];
        if (afterGap < 0) {
            (function (gap) {
                /*@ts-ignore*/
                var diffArray = __spreadArray([], Array(-gap), true).map(function () { return mainDayStructureArray.pop(); });
                diffArray.reverse();
                for (var i_1 = 0; i_1 < diffArray.length; i_1++) {
                    var place = 28 - youbiNum + i_1;
                    mainDayStructureArray[place].afterText = diffArray[i_1].dayText;
                    mainDayStructureArray[place].isSeparated = true;
                    if (diffArray[i_1].isHoliday) {
                        mainDayStructureArray[place].isRightHoliday = true;
                    }
                    if (mainDayStructureArray[place].isHoliday) {
                        mainDayStructureArray[place].isLeftHoliday = true;
                    }
                }
            })(afterGap);
        }
        return __spreadArray(__spreadArray(__spreadArray([], beforeDayStructureArray, true), mainDayStructureArray, true), afterDayStructureArray, true);
    });
    return allArangedData;
};
//変換されたデータ
var arrangedDataArray = getArrangedDataArray(diary.data);
////////////////////////////////////////
//	エンティティの定義
////////////////////////////////////////
//エンティティの定義
var _firstPageEntity = new firstPageEntity(app.activeDocument.pages[0]);
/*@ts-ignore*/
var allCalenderPageEntity = __spreadArray([], Array(app.activeDocument.pages.length), true).map(function (_, i) {
    var page = pages[i];
    return new diaryCalenderPageEntity(page);
});
//マスターページのアイテムをストック
var master = new masterPageItem();
//スタイルの定義
var paraStyles = new Styles(app.activeDocument.paragraphStyles);
var charStyles = new Styles(app.activeDocument.characterStyles);
////////////////////////////////////////
//処理の開始
////////////////////////////////////////
//初期化処理
/* @ts-ignore */
pages[0].textFrames[0].parentStory.characters.everyItem().remove();
//テキストの挿入
(function (arrangedDataArray) {
    /*@ts-ignore*/
    var dayString = arrangedDataArray.map(function (v) { return v.map(function (v) { return v.dayText; }).join("\r"); });
    _firstPageEntity.dayInsertionPoint.appliedParagraphStyle = paraStyles.getStyle("Calendar_平日");
    for (var i = 0; i < dayString.length; i++) {
        _firstPageEntity.dayStory.insertionPoints[-1].contents = dayString[i];
        if (i !== dayString.length - 1)
            _firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
    }
    /*@ts-ignore*/
    _firstPageEntity.dayStory.characters.everyItem().appliedCharacterStyle = charStyles.getStyle("[なし]");
    _firstPageEntity.dayStory.clearOverrides(); //Story上のオーバーライドを一括消去
})(arrangedDataArray);
var pageItemNames = [
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
(function (arrangedDataArray) {
    for (var i = 0; i < app.activeDocument.pages.length; i++) {
        var page = app.activeDocument.pages[i];
        var pageEntity = new diaryCalenderPageEntity(page);
        var pageStructure = arrangedDataArray[i];
        // $.writeln(`page ${i + 1}`);
        for (var i_2 = 0; i_2 < pageStructure.length; i_2++) {
            var tf = pageEntity.getByName(pageItemNames[i_2]);
            if (pageStructure[i_2].isSeparated) {
                if (pageStructure[i_2].isSunday || pageStructure[i_2].isHoliday) {
                    tf.characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付aka");
                    tf.characters[1].appliedCharacterStyle = charStyles.getStyle("小数字_上付aka");
                    var slash = master.rSlash[0].duplicate([0, 0], [0, 0]);
                    slash.anchoredObjectSettings.insertAnchoredObject(tf.insertionPoints[0], AnchorPosition.ANCHORED);
                    slash.clearObjectStyleOverrides();
                    tf.insertionPoints[-2].contents = pageStructure[i_2].afterText;
                    tf.characters[-2].appliedCharacterStyle = charStyles.getStyle("小数字_下付aka");
                    tf.characters[-3].appliedCharacterStyle = charStyles.getStyle("小数字_下付aka");
                    if (pageStructure[i_2].isLeftHoliday) {
                        $.writeln("left holiday");
                        var circleInsertionPoint = tf.insertionPoints[0];
                        var circleSmall = master.sCircle[0].duplicate([0, 0], [0, 0]);
                        circleSmall.anchoredObjectSettings.insertAnchoredObject(circleInsertionPoint, AnchorPosition.ANCHORED);
                        circleSmall.clearObjectStyleOverrides();
                    }
                    if (pageStructure[i_2].isRightHoliday) {
                        $.writeln("right holiday");
                        var circleInsertionPoint = tf.insertionPoints[-4];
                        var circleSmall = master.sCircle[0].duplicate([0, 0], [0, 0]);
                        circleSmall.anchoredObjectSettings.insertAnchoredObject(circleInsertionPoint, AnchorPosition.ANCHORED);
                        circleSmall.clearObjectStyleOverrides();
                    }
                }
                else {
                    tf.characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付BK");
                    tf.characters[1].appliedCharacterStyle = charStyles.getStyle("小数字_上付BK");
                    var slash = master.bSlash[0].duplicate([0, 0], [0, 0]);
                    slash.anchoredObjectSettings.insertAnchoredObject(tf.insertionPoints[0], AnchorPosition.ANCHORED);
                    slash.clearObjectStyleOverrides();
                    tf.insertionPoints[-2].contents = pageStructure[i_2].afterText;
                    tf.characters[-2].appliedCharacterStyle = charStyles.getStyle("小数字_下付BK");
                    tf.characters[-3].appliedCharacterStyle = charStyles.getStyle("小数字_下付BK");
                }
            }
            else {
                if (pageStructure[i_2].isHoliday) {
                    var insertionPoint = tf.insertionPoints[0];
                    var oval = master.lCircle[0].duplicate([0, 0], [0, 0]);
                    oval.anchoredObjectSettings.insertAnchoredObject(insertionPoint, AnchorPosition.ANCHORED);
                    oval.clearObjectStyleOverrides();
                }
                if (pageStructure[i_2].isHoliday || pageStructure[i_2].isSunday) {
                    /*@ts-ignore*/
                    tf.characters.everyItem().appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
                    // $.writeln(tf.contents + " is holiday");
                }
                else if (pageStructure[i_2].isSaturday) {
                    /*@ts-ignore*/
                    tf.characters.everyItem().appliedParagraphStyle = paraStyles.getStyle("Calendar_土曜");
                    // $.writeln(tf.contents + " is saturday");
                }
            }
        }
        $.writeln("------------");
    }
})(arrangedDataArray);
