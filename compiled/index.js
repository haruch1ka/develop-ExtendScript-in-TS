var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { diaryGekkanDayStructure, diaryGekkanPageStructure } from "./diaryGekkanStructure";
import polyfill from "./polyfill/polyfill";
import calendar from "./calendar";
import diaryInputData from "./diaryInputData";
import { diaryGekkanPageEntity, firstPageEntity } from "./diaryGekkanEntity";
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
    var _a = [
        [inputData[1][1], inputData[1][2]],
        [inputData[inputData.length - 1][1], inputData[inputData.length - 1][2]],
    ], from = _a[0], to = _a[1];
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
var _firstPageEntity = new firstPageEntity(pages[0]);
$.writeln(_firstPageEntity.dayStory.contents);
$.writeln(_firstPageEntity.weekStory.contents);
$.writeln(_firstPageEntity.holidayStory.contents);
///////////////////////////
// 処理の開始
///////////////////////////
/*@ts-ignore*/
for (var i = 0; i < pages[0].textFrames.length; i++) {
    var textFrame = pages[0].textFrames[i];
    /*@ts-ignore */
    textFrame.parentStory.characters.everyItem().remove();
}
//テキストの挿入
(function (arrangedDataArray) {
    //ページごとにデータを挿入
    for (var i = 3; i < arrangedDataArray.length; i++) {
        //日、週、祝日の文字列を取得
        /*@ts-ignore*/
        var dayString = arrangedDataArray[i].dayStructureArray.map(function (structure) { return structure.dayText; }).join("\r");
        /*@ts-ignore*/
        var weekString = arrangedDataArray[i].dayStructureArray.map(function (structure) { return structure.weekText; }).join("\r");
        /*@ts-ignore*/
        var holidayString = arrangedDataArray[i].dayStructureArray.map(function (structure) { return structure.holidayText; }).join("\r");
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
        var pageEntity = new diaryGekkanPageEntity(pages[i]);
        // pageEntity.yearTextFrame.contents = arrangedDataArray[i].yearText;
        // pageEntity.monthTextFrame.contents = arrangedDataArray[i].monthText;
    }
})(allArangedData);
