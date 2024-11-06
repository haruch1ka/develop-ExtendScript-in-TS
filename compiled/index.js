var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { diaryGekkanDayStructure, diaryGekkanPageStructure, getTextframeIndex } from "./diaryGekkanStructure";
import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import Styles from "./Props/Styles";
import diaryInputData from "./diaryInputData";
import { diaryGekkanEvenPageEntity, diaryGekkanOddPageEntity, firstPageEntity } from "./diaryGekkanEntity";
polyfill();
var pages = app.activeDocument.pages;
///////////////////////////
// データの取得
///////////////////////////
//エクセルデータの取得
var diaryData = new diaryInputData().data;
//年を取得して数値に変換
var year = parseInt(diaryData[1][1]);
//カレンダークラスのインスタンス化
var cal = new calendar();
//エクセルの前月のデータを、[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 , 31, 28, 31, 30]のように分ける
var monthEachDataConverted = function (inputData) {
    var cal = new calendar();
    var allMonthDaysLength = __spreadArray(__spreadArray([], cal.getMonthDaysLengths(year), true), cal.getMonthDaysLengths(year + 1).slice(0, 4), true);
    var allMonthDataArray = []; //月ごとにデータを格納する配列
    var counter = 0;
    for (var i = 0; i < allMonthDaysLength.length; i++) {
        /*@ts-ignore*/
        var monthData = __spreadArray([], inputData.slice(counter + 1, allMonthDaysLength[i] + counter + 1), true);
        allMonthDataArray.push(monthData);
        counter += allMonthDaysLength[i];
    }
    return allMonthDataArray;
};
//取得したデータを変換
var getArrangedDataArray = function (monthDataArray) {
    var weekNumList = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
    /*@ts-ignore*/
    var allArangedData = allMonthDataArray.map(function (month, i) {
        var monthData = month;
        var firstYoubi = month[0][6];
        var youbiNum = weekNumList[firstYoubi];
        var createMainDayStructureArray = function () {
            var mainDayStructureArray = monthData.map(function (day) {
                var _dayStructure = new diaryGekkanDayStructure(day[3], day[6], day[7], day[2], day[1]);
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
        var dayStructureArray = createMainDayStructureArray();
        return new diaryGekkanPageStructure(dayStructureArray);
    });
    return allArangedData;
};
var allMonthDataArray = monthEachDataConverted(diaryData);
var allArangedData = getArrangedDataArray(allMonthDataArray);
///////////////////////////
// エンティティの定義
///////////////////////////
var _firstPageEntity = new firstPageEntity(pages[0]);
//スタイルの定義
var paraStyles = new Styles(app.activeDocument.paragraphStyles);
var charStyles = new Styles(app.activeDocument.characterStyles);
// const holidayCharStyle = charStyles.itemByName("");
///////////////////////////
// 処理の開始
///////////////////////////
/*@ts-ignore*/
for (var i = 0; i < pages[0].textFrames.length; i++) {
    var textFrame = pages[0].textFrames[i];
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
// //テキストの挿入
(function (arrangedDataArray) {
    //indexが3以上のデータを取得
    var targetArray = arrangedDataArray.slice(3);
    //ページごとにデータを挿入
    for (var i = 0; i < targetArray.length; i++) {
        //日、週、祝日の文字列を取得
        /*@ts-ignore*/
        var dayString = targetArray[i].dayStructureArray.map(function (structure) { return structure.dayText; }).join("\r");
        /*@ts-ignore*/
        var weekString = targetArray[i].dayStructureArray.map(function (structure) { return structure.weekText; }).join("\r");
        /*@ts-ignore*/
        var holidayString = targetArray[i].dayStructureArray.map(function (structure) { return structure.holidayText; }).join("\r");
        //日、週、祝日の文字列を挿入
        _firstPageEntity.dayStory.insertionPoints[-1].contents = dayString;
        _firstPageEntity.weekStory.insertionPoints[-1].contents = weekString;
        _firstPageEntity.holidayStory.insertionPoints[-1].contents = holidayString;
        if (i !== dayString.length - 1)
            _firstPageEntity.dayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
        if (i !== weekString.length - 1)
            _firstPageEntity.weekStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
        if (i !== holidayString.length - 1)
            _firstPageEntity.holidayStory.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
    }
})(allArangedData);
(function (arrangedDataArray) {
    //indexが3以上のデータを取得
    var targetArray = arrangedDataArray.slice(3);
    //ページごとにデータを挿入
    for (var i = 0; i < app.activeDocument.pages.length / 2; i++) {
        var even = i * 2;
        var odd = i * 2 + 1;
        var evenPageEntity = new diaryGekkanEvenPageEntity(pages[even]); // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18...
        var oddPageEntity = new diaryGekkanOddPageEntity(pages[odd]); // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19...
        //偶数(0, 2, 4, 6, 8, 10, 12, 14, 16, 18...)ページに月の文字列を挿入
        //奇数(1, 3, 5, 7, 9, 11, 13, 15, 17, 19...)ページに年の文字列を挿入
        evenPageEntity.monthTextFrame.contents = targetArray[i].monthText;
        oddPageEntity.yearTextFrame.contents = targetArray[i].yearText;
    }
})(allArangedData);
(function (arrangedDataArray) {
    //ページの祝日の文字にスタイルを適用
    var targetArray = arrangedDataArray.slice(3);
    // $.writeln(targetArray);
    for (var i = 0; i < app.activeDocument.pages.length / 2; i++) {
        var even = i * 2;
        var odd = i * 2 + 1;
        var evenPageEntity = new diaryGekkanEvenPageEntity(pages[even]); // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18...
        var oddPageEntity = new diaryGekkanOddPageEntity(pages[odd]); // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19...
        var leftDayTextFrame = evenPageEntity.dayTextFrame;
        var rightDayTextFrame = oddPageEntity.dayTextFrame;
        // $.writeln(targetArray[i].leftPageHolidayArray);
        // $.writeln(targetArray[i].rightPageHolidayArray);
        $.writeln("i : " + i);
        $.writeln("-----------------");
        for (var j = 0; j < targetArray[i].leftPageSaturdayArray.length; j++) {
            var index = targetArray[i].leftPageSaturdayArray[j];
            if (index) {
                var charIndex = getTextframeIndex(0, 15, j)[0];
                var charLength = getTextframeIndex(0, 15, j)[1];
                for (var k = charIndex; k > charIndex - charLength; k--) {
                    $.writeln(leftDayTextFrame.characters[k].contents);
                    leftDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka50");
                }
            }
        }
        for (var j = 0; j < targetArray[i].rightPageSaturdayArray.length; j++) {
            var index = targetArray[i].rightPageSaturdayArray[j];
            if (index) {
                var charIndex = getTextframeIndex(16, 30, j)[0];
                var charLength = getTextframeIndex(16, 30, j)[1];
                for (var k = charIndex; k > charIndex - charLength; k--) {
                    $.writeln(rightDayTextFrame.characters[k].contents);
                    rightDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka50");
                }
            }
        }
        for (var j = 0; j < targetArray[i].leftPageHolidayArray.length; j++) {
            var index = targetArray[i].leftPageHolidayArray[j];
            if (index) {
                var charIndex = getTextframeIndex(0, 15, j)[0];
                var charLength = getTextframeIndex(0, 15, j)[1];
                for (var k = charIndex; k > charIndex - charLength; k--) {
                    $.writeln(leftDayTextFrame.characters[k].contents);
                    leftDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka100");
                }
            }
        }
        for (var j = 0; j < targetArray[i].rightPageHolidayArray.length; j++) {
            var index = targetArray[i].rightPageHolidayArray[j];
            if (index) {
                var charIndex = getTextframeIndex(16, 30, j)[0];
                var charLength = getTextframeIndex(16, 30, j)[1];
                for (var k = charIndex; k > charIndex - charLength; k--) {
                    $.writeln(rightDayTextFrame.characters[k].contents);
                    rightDayTextFrame.characters[k].appliedCharacterStyle = charStyles.getStyle("aka100");
                }
            }
        }
        $.writeln("-----------------");
    }
})(allArangedData);
