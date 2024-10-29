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
import { firstPageEntity } from "./diaryCalenderPageEntity";
//月ごとのテキストデータを生成するクラス
var monthText = /** @class */ (function () {
    function monthText(month, year, cal) {
        var _this = this;
        this.daysTextArray = [];
        this.beforeDashArray = [];
        this.afterDashArray = [];
        this.dividedNumArray = [];
        this.youbi = cal.getYoubi(year, month, 1); //数字で曜日を取得
        /*@ts-ignore*/
        if (this.youbi !== 0)
            __spreadArray([], Array(this.youbi), true).map(function () { return _this.beforeDashArray.push("..."); });
        if (this.youbi === 0)
            this.beforeDashArray.push("-1");
        /*@ts-ignore*/
        __spreadArray([], Array(cal.monthDays[month - 1]), true).map(function (_, i) { return _this.daysTextArray.push(String(i + 1)); });
        this.swapDate();
    }
    monthText.prototype.swapDate = function () {
        var _this = this;
        var length = this.daysTextArray.length;
        var diff = 35 - (this.youbi + length);
        if (diff > 0) {
            /*@ts-ignore*/
            __spreadArray([], Array(diff), true).map(function () { return _this.afterDashArray.push("..."); });
            this.dividedNumArray.push(-1);
        }
        else if (diff < 0) {
            /*@ts-ignore*/
            var diffArray = __spreadArray([], Array(-diff), true).map(function () { return _this.daysTextArray.pop(); });
            diffArray.reverse();
            /*@ts-ignore*/
            diffArray.map(function (v, i) {
                var place = 29 - _this.youbi + i * 2;
                _this.daysTextArray.splice(place, 0, v);
                _this.dividedNumArray.push(place);
            });
            this.afterDashArray.push("-1");
        }
        else {
            this.afterDashArray.push("-1");
            this.dividedNumArray.push(-1);
        }
    };
    return monthText;
}());
//月ごとのテキストデータをストックするクラス
var stockText = /** @class */ (function () {
    function stockText() {
        this.beforeTextArray = [];
        this.mainTextArray = [];
        this.afterTextArray = [];
    }
    stockText.prototype.stockText = function (_monthTextInstance) {
        var beforeText = this.makeText(_monthTextInstance.beforeDashArray).slice(0, -1); //beforeTextの最後の改行を削除
        var mainText = this.makeText(_monthTextInstance.daysTextArray).slice(0, -1); //mainTextの最後の改行を削除
        var afterText = this.makeTextReverce(_monthTextInstance.afterDashArray); //afterTextの最後の改行を削除
        this.beforeTextArray.push(beforeText);
        this.mainTextArray.push(mainText);
        this.afterTextArray.push(afterText);
    };
    stockText.prototype.makeText = function (textArray) {
        var text = "";
        for (var i = 0; i < textArray.length; i++) {
            text += textArray[i] + "\r";
        }
        return text;
    };
    stockText.prototype.makeTextReverce = function (textArray) {
        var text = "";
        for (var i = textArray.length; i < textArray.length; i++) {
            text += "\r" + textArray[i];
        }
        return text;
    };
    return stockText;
}());
//月ごとのテキストデータの配置場所をストックするクラス
var stockPlace = /** @class */ (function () {
    function stockPlace() {
        this.placeArrayArray = [];
    }
    stockPlace.prototype.stockPlace = function (_monthTextInstance) {
        this.placeArrayArray.push(_monthTextInstance.dividedNumArray);
    };
    stockPlace.prototype.getPlaceArrayArray = function () {
        return this.placeArrayArray;
    };
    return stockPlace;
}());
//月ごとの日付リストをストックするクラス
var stockDaysList = /** @class */ (function () {
    function stockDaysList() {
        this.daysListArray = [];
    }
    stockDaysList.prototype.stockDaysList = function (_monthTextInstance) {
        this.daysListArray.push(_monthTextInstance.daysTextArray);
    };
    return stockDaysList;
}());
//月ごとのダッシュテキストをストックするクラス
var stockDashArray = /** @class */ (function () {
    function stockDashArray() {
        this.beforeDashArray = [];
        this.afterDashArray = [];
    }
    stockDashArray.prototype.stockDashArray = function (_monthTextInstance) {
        this.beforeDashArray.push(_monthTextInstance.beforeDashArray);
        this.afterDashArray.push(_monthTextInstance.afterDashArray);
    };
    return stockDashArray;
}());
//すべてのストックされたデータをまとめるクラス
var calTextData = /** @class */ (function () {
    function calTextData(pages, year) {
        this.stockText = new stockText();
        this.stockPlace = new stockPlace();
        this.stockDaysList = new stockDaysList();
        this.stockDashArray = new stockDashArray();
        for (var j = 0; j < pages.length; j++) {
            var pageIndex = j;
            var tarYear = j > 11 ? year + 1 : year;
            var tarMonth = j > 11 ? j - 11 : j + 1;
            /*月のテキストデータを取得 */
            var _monthText = new monthText(tarMonth, tarYear, new calendar());
            this.stockText.stockText(_monthText);
            this.stockPlace.stockPlace(_monthText);
            this.stockDaysList.stockDaysList(_monthText);
            this.stockDashArray.stockDashArray(_monthText);
        }
    }
    return calTextData;
}());
//ページアイテムをストックするクラス
var pageItemStoker = /** @class */ (function () {
    function pageItemStoker(page) {
        this.sunNameList = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
        this.satNameList = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];
        this.allNameList = [
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
        this.allName = [];
        this.page = page;
    }
    pageItemStoker.prototype.getSunItemList = function () {
        /*@ts-ignore*/
        return this.getListItems(this.sunNameList);
    };
    pageItemStoker.prototype.getSatItemList = function () {
        return this.getListItems(this.satNameList);
    };
    pageItemStoker.prototype.getListItems = function (list) {
        var itemList = [];
        for (var i = 0; i < list.length; i++) {
            var item = this.page.pageItems.itemByName(list[i]);
            itemList.push(item);
        }
        return itemList;
    };
    pageItemStoker.prototype.getItemByName = function (name) {
        return this.page.pageItems.itemByName(name);
    };
    return pageItemStoker;
}());
//マスターページのアイテムをストックするクラス
var masterPageItem = /** @class */ (function () {
    function masterPageItem() {
        this.itemNameList = ["赤円_小", "赤円_大", "スラッシュ_赤小", "スラッシュ_黒小"];
        this.itemPropertyNameList = ["sCircle", "lCircle", "rSlash", "bSlash"];
        this.itemList = [];
        this.master = app.activeDocument.masterSpreads[0];
        var _pageItemStoker = new pageItemStoker(this.master);
        this.allName = _pageItemStoker.allName;
        /*@ts-ignore*/
        this.itemList = this.itemNameList.map(function (v) { return _pageItemStoker.getItemByName(v).getElements(); });
        for (var i = 0; i < this.itemList.length; i++) {
            /*@ts-ignore*/
            this[this.itemPropertyNameList[i]] = this.itemList[i];
        }
    }
    masterPageItem.prototype.getItemByName = function (name) {
        return this.master.pageItems.itemByName(name);
    };
    return masterPageItem;
}());
polyfill();
var diary = new diaryInputData();
var cal = new calendar();
var grobalYear = parseInt(diary.data[1][1]);
/*@ts-ignore*/
var holidayData = diary.data.map(function (v) { return v[0]; });
holidayData.shift();
/*グローバル変数の設定*/
var pages = app.activeDocument.pages;
var getArrangedArray = function (inputData) {
    var _a = [
        [inputData[1][1], inputData[1][2]],
        [inputData[inputData.length - 1][1], inputData[inputData.length - 1][2]],
    ], from = _a[0], to = _a[1];
    var cal = new calendar();
    var weekNumList = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
    var allMonthDaysLength = __spreadArray(__spreadArray([], cal.getMonthDaysLengths(grobalYear), true), cal.getMonthDaysLengths(grobalYear + 1).slice(0, 4), true);
    $.writeln(allMonthDaysLength);
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
                    var tarDay = mainDayStructureArray[place].dayText + diffArray[i_1].dayText;
                    mainDayStructureArray[place].dayText = tarDay;
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
        /*@ts-ignore*/
        // mainDayStructureArray.map((data) => {
        // 	$.writeln(
        // 		`day : ${data.dayText},${data.isHoliday ? " isHoliday" : ""}${data.isSeparated ? " isSeparated" : ""}${data.isSunday ? " isSunday" : ""}${data.isSaturday ? " isSaturday" : ""}${data.isLeftHoliday ? " isLeftHoliday" : ""}${data.isRightHoliday ? " isRightHoliday" : ""}`
        // 	);
        // });
        $.writeln("--------------------");
        // if (afterDayStructureArray.length > 0) {
        // 	/*@ts-ignore*/
        // 	afterDayStructureArray.map((v) => {
        // 		$.writeln(v.dayText);
        // 	});
        // }
        var res = __spreadArray(__spreadArray(__spreadArray([], beforeDayStructureArray, true), mainDayStructureArray, true), afterDayStructureArray, true);
        return res;
    });
    return allArangedData;
};
var arrangedArray = getArrangedArray(diary.data);
/*@ts-ignore*/
// arrangedArray.map((months) => {
// 	$.writeln("------------");
// 	/*@ts-ignore*/
// 	months.map((day) => {
// 		$.writeln(
// 			`day : ${day.dayText},${day.isHoliday ? " isHoliday" : ""}${day.isSeparated ? " isSeparated" : ""}${day.isSunday ? " isSunday" : ""}${day.isSaturday ? " isSaturday" : ""}${day.isLeftHoliday ? " isLeftHoliday" : ""}${day.isRightHoliday ? " isRightHoliday" : ""}`
// 		);
// 	});
// });
var calTexts = new calTextData(pages, grobalYear);
var master = new masterPageItem();
//スタイルの定義
var paraStyles = new Styles(app.activeDocument.paragraphStyles);
var charStyles = new Styles(app.activeDocument.characterStyles);
//エンティティの定義
var _firstPageEntity = new firstPageEntity(app.activeDocument.pages[0]);
var createHolidayIndex = function (inputDataArray, calTexts) {
    var daysListArray = calTexts.stockDaysList.daysListArray;
    /*@ts-ignore*/
    var sliceByMonthArray = daysListArray.map(function (_, i) {
        return inputDataArray.splice(0, daysListArray[i].length);
    });
    /*@ts-ignore*/
    return sliceByMonthArray.map(function (v, i) {
        var monthData = v;
        var monthHolidayIndexArray = [];
        for (var j = 0; j < monthData.length; j++) {
            if (monthData[j] === "h")
                monthHolidayIndexArray.push(j);
        }
        if (monthHolidayIndexArray.length === 0)
            monthHolidayIndexArray.push(-1);
        return monthHolidayIndexArray;
    });
};
var insertText = function (calTexts) {
    _firstPageEntity.dayInsertionPoint.appliedParagraphStyle = paraStyles.getStyle("Calendar_平日");
    for (var i = 0; i < calTexts.stockText.mainTextArray.length; i++) {
        _firstPageEntity.dayStory.insertionPoints[-1].contents = calTexts.stockText.mainTextArray[i];
        _firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
    }
    /*@ts-ignore*/
    _firstPageEntity.dayStory.characters.everyItem().appliedCharacterStyle = charStyles.getStyle("[なし]");
    _firstPageEntity.dayStory.clearOverrides(); //Story上のオーバーライドを一括消去
};
var insertHolidayText = function (pages, holidayIndex, master, calTex) {
    for (var i = 0; i < holidayIndex.length; i++) {
        $.writeln(holidayIndex[i]);
    }
    var _loop_1 = function (i) {
        var _pageItemStoker = new pageItemStoker(pages[i]);
        var indexArray = holidayIndex[i];
        if (indexArray[0] === -1)
            return "continue";
        /*@ts-ignore*/
        var fixedIndexArray = indexArray.map(function (v) { return calTex.stockDaysList.daysListArray[i].indexOf(String(v + 1)); });
        /*@ts-ignore*/
        var tf = fixedIndexArray.map(function (v) { return _pageItemStoker.getItemByName(_pageItemStoker.allNameList[v]).getElements(); });
        for (var j = 0; j < tf.length; j++) {
            tf[j][0].characters.everyItem().appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
            var insertionPoint = tf[j][0].insertionPoints[0];
            var oval = master.lCircle[0].duplicate([0, 0], [0, 0]);
            oval.anchoredObjectSettings.insertAnchoredObject(insertionPoint, AnchorPosition.ANCHORED);
            oval.clearObjectStyleOverrides();
        }
    };
    for (var i = 0; i < holidayIndex.length; i++) {
        _loop_1(i);
    }
};
/*上下を分けるスタイルの適用*/
var jougeStyle = function (calTexts) {
    var _loop_2 = function (i) {
        var indexArray = calTexts.stockPlace.placeArrayArray[i];
        if (indexArray[0] === -1)
            return "continue";
        var page = app.activeDocument.pages[i];
        var _pageItemStoker = new pageItemStoker(page);
        var getItem = function (indexArray, _pageItemStoker, num1) {
            /*@ts-ignore*/
            var item = __spreadArray([], Array(2), true).map(function (_, i) {
                return _pageItemStoker.getItemByName(_pageItemStoker.allNameList[indexArray[num1] - 1 + i]);
            });
            /*@ts-ignore*/
            var tf = item.map(function (v) { return v.getElements(); });
            return tf;
        };
        var _a = [6, 4], akaStyleNum = _a[0], bkStyleNum = _a[1];
        if (indexArray.length === 1 || indexArray.length === 2) {
            /*@ts-ignore*/
            getItem(indexArray, _pageItemStoker, 0).map(function (v, i) {
                v[0].characters[-3].appliedCharacterStyle = app.activeDocument.characterStyles[i + akaStyleNum];
                v[0].characters[-2].appliedCharacterStyle = app.activeDocument.characterStyles[i + akaStyleNum];
            });
        }
        if (indexArray.length === 2) {
            /*@ts-ignore*/
            getItem(indexArray, _pageItemStoker, 1).map(function (v, i) {
                v[0].characters[-3].appliedCharacterStyle = app.activeDocument.characterStyles[i + bkStyleNum];
                v[0].characters[-2].appliedCharacterStyle = app.activeDocument.characterStyles[i + bkStyleNum];
            });
        }
    };
    for (var i = 0; i < calTexts.stockPlace.placeArrayArray.length; i++) {
        _loop_2(i);
    }
};
var removeBreak = function (calTexs, master) {
    for (var i = 0; i < calTexts.stockPlace.placeArrayArray.length; i++) {
        var indexArray = calTexts.stockPlace.placeArrayArray[i];
        if (indexArray[0] === -1)
            continue;
        var page = app.activeDocument.pages[i];
        var _pageItemStoker = new pageItemStoker(page);
        if (indexArray.length === 1 || indexArray.length === 2) {
            var tarChars = _pageItemStoker.getItemByName(_pageItemStoker.allNameList[indexArray[0] - 1]).getElements()[0].characters;
            //slashの挿入
            var slash = master.rSlash[0].duplicate([0, 0], [0, 0]);
            slash.anchoredObjectSettings.insertAnchoredObject(tarChars.firstItem().insertionPoints[0], AnchorPosition.ANCHORED);
            slash.clearObjectStyleOverrides();
            tarChars.firstItem().characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付aka");
            //breakの削除
            tarChars.lastItem().remove();
        }
        if (indexArray.length === 2) {
            var tarChars = _pageItemStoker.getItemByName(_pageItemStoker.allNameList[indexArray[1] - 2]).getElements()[0].characters;
            //slashの挿入
            var slash = master.bSlash[0].duplicate([0, 0], [0, 0]);
            slash.anchoredObjectSettings.insertAnchoredObject(tarChars.firstItem().insertionPoints[0], AnchorPosition.ANCHORED);
            slash.clearObjectStyleOverrides();
            tarChars.firstItem().characters[0].appliedCharacterStyle = charStyles.getStyle("小数字_上付BK");
            //breakの削除
            tarChars.lastItem().remove();
        }
    }
};
var insertDash = function (calTexts) {
    var _daysListArray = calTexts.stockDaysList.daysListArray;
    var _stockDashArray = calTexts.stockDashArray;
    for (var i = 0; i < _daysListArray.length; i++) {
        var page = app.activeDocument.pages[i];
        var _pageItemStoker = new pageItemStoker(page);
        if (_stockDashArray.afterDashArray[i][0] !== "-1") {
            var lastItem = _pageItemStoker.allNameList[_daysListArray[i].length - 1];
            var lastItemObj = _pageItemStoker.getItemByName(lastItem).getElements()[0];
            var lastInsertionPoint = lastItemObj.insertionPoints[-2];
            /*@ts-ignore*/
            lastInsertionPoint.appliedCharacterStyle = charStyles.getStyle("黒100");
            var afterText = "";
            for (var j = 0; j < _stockDashArray.afterDashArray[i].length; j++) {
                afterText += "\r" + _stockDashArray.afterDashArray[i][j];
            }
            lastInsertionPoint.contents = afterText;
        }
        if (_stockDashArray.beforeDashArray[i][0] !== "-1") {
            var firstItem = _pageItemStoker.allNameList[0];
            var firstItemObj = _pageItemStoker.getItemByName(firstItem);
            var firstInsertionPoint = firstItemObj.getElements()[0].insertionPoints[0];
            /*@ts-ignore*/
            firstInsertionPoint.appliedCharacterStyle = charStyles.getStyle("黒100");
            var beforeText = "";
            for (var j = 0; j < _stockDashArray.beforeDashArray[i].length; j++) {
                beforeText += _stockDashArray.beforeDashArray[i][j] + "\r";
            }
            firstInsertionPoint.contents = beforeText;
        }
    }
};
/*土日にスタイルを適用*/
var applyParaStyle = function (calTexts) {
    var sunNameList = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
    var satNameList = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];
    for (var i = 0; i < calTexts.stockDaysList.daysListArray.length; i++) {
        var page = app.activeDocument.pages[i];
        var _pageItemStoker = new pageItemStoker(page);
        var sunTextFrames = _pageItemStoker.getSunItemList();
        var satTextFrames = _pageItemStoker.getSatItemList();
        var containEllipsis = function (test) {
            var regex = new RegExp(/\.\.\./);
            return regex.test(test);
        };
        var getNonDigitOrDotLength = function (text) {
            var regex = new RegExp(/[^0-9]/g);
            var matches = text.match(regex);
            return matches ? matches.length : 0;
        };
        for (var i_2 = 0; i_2 < sunTextFrames.length; i_2++) {
            var sunEveryItem = sunTextFrames[i_2].characters.everyItem();
            sunEveryItem.appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
            //上下のスタイルを壊さないために、最初のテキストフレームのみaka100を適用
            if (containEllipsis(sunTextFrames[i_2].contents))
                sunEveryItem.appliedCharacterStyle = charStyles.getStyle("aka100");
        }
        for (var i_3 = 0; i_3 < satTextFrames.length; i_3++) {
            var satEveryItem = satTextFrames[i_3].characters.everyItem();
            satEveryItem.appliedParagraphStyle = paraStyles.getStyle("Calendar_土曜");
            if (getNonDigitOrDotLength(satTextFrames[i_3].contents) > 1) {
                satEveryItem.appliedParagraphStyle = paraStyles.getStyle("Calendar_日祝");
            }
            if (containEllipsis(satTextFrames[i_3].contents) && i_3 === 4)
                satEveryItem.appliedCharacterStyle = charStyles.getStyle("aka50");
        }
    }
};
//初期化処理
/*@ts-ignore*/
app.activeDocument.pages[0].textFrames[0].parentStory.characters.everyItem().remove(); //Story上のテキストを一括削除
//データの挿入
//ストーリーに一括挿入
// const holidayIndex = createHolidayIndex(holidayData, calTexts);
// insertText(calTexts);
// if (holidayIndex) insertHolidayText(pages, holidayIndex, master, calTexts);
// jougeStyle(calTexts);
// removeBreak(calTexts, master);
// insertDash(calTexts);
// applyParaStyle(calTexts);
