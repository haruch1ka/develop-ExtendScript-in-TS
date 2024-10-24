var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import diaryInputData from "./diaryInputData";
import calendar from "./calendar";
import polyfill from "./polyfill/polyfill";
import { diaryPageEntity, firstPageEntity } from "./diaryPageEntity";
import { diaryPageStracture, diaryDayStracture } from "./diaryPageStructure";
import myMasterPageItem from "./Props/myMasterItem";
import { formatText } from "./Props/TextFrameWrapper";
polyfill();
var diary = new diaryInputData();
var cal = new calendar();
var year = parseInt(diary.data[1][1]);
var youbiToDaysGap = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日
//曜日に応じて、穴埋めで入る前年度の日にちを取得する。
var getBeforeGap = function (year) {
    var youbiNum = cal.getYoubi(year, 4, 1);
    var gap = youbiToDaysGap[youbiNum];
    return gap;
};
//前年度と今年度の日数から、穴埋めで入る来年度の日数を取得する。
var getAfterGap = function (beforePlusYearLength) {
    var input = beforePlusYearLength;
    if (input % 7 !== 0) {
        return (Math.floor(input / 7) + 1) * 7 - input;
    }
    else {
        return 0;
    }
    throw new Error("error");
};
//要素の数を取得
var beforeGap = getBeforeGap(year);
var yearLength = cal.isLeapYear(year + 1) ? 366 : 365;
var AfterGap = getAfterGap(beforeGap + yearLength);
//1月から3月までの日数を取得
var monthLength = cal.getMonthLength(1, 3);
//すべてのデータを取得(2行目からなのでindexは常に+1)
var beforeData = diary.data.slice(monthLength - beforeGap + 1, monthLength + 1);
var mainData = diary.data.slice(monthLength + 1, monthLength + yearLength + 1);
var afterData = diary.data.slice(monthLength + yearLength + 1, monthLength + yearLength + AfterGap + 1);
/*@ts-ignore*/
var daysText = __spreadArray(__spreadArray(__spreadArray([], beforeData.map(function (v) { return v[3]; }), true), mainData.map(function (v) { return v[3]; }), true), afterData.map(function (v) { return v[3]; }), true).join("\r");
/*@ts-ignore*/
var rokuyouText = __spreadArray(__spreadArray(__spreadArray([], beforeData.map(function (v) { return v[8]; }), true), mainData.map(function (v) { return v[8]; }), true), afterData.map(function (v) { return v[8]; }), true).join("\r");
/*@ts-ignore*/
var holidayText = __spreadArray(__spreadArray(__spreadArray([], beforeData.map(function (v) { return v[7]; }), true), mainData.map(function (v) { return v[7]; }), true), afterData.map(function (v) { return v[7]; }), true).join("\r");
//入力先のエンティティを取得
var _firstPageEntity = new firstPageEntity(app.activeDocument.pages[11]);
var _masterItem = new myMasterPageItem(2);
_firstPageEntity.dayStory.contents = daysText;
_firstPageEntity.rokuyouStory.contents = rokuyouText;
_firstPageEntity.holidayStory.contents = holidayText;
//流し込むデータの構造を作成
//前年度、今年度、来年度のデータ構造をそれぞれ作成
/*@ts-ignore*/
var _diaryDayStractureBefore = beforeData.map(function (v) {
    var _instance = new diaryDayStracture(v);
    _instance.setGlayActivate();
    return _instance;
});
/*@ts-ignore*/
var _diaryDayStractureMain = mainData.map(function (v) {
    return new diaryDayStracture(v);
});
/*@ts-ignore*/
var _diaryDayStractureAfter = afterData.map(function (v) {
    var _instance = new diaryDayStracture(v);
    _instance.setGlayActivate();
    return _instance;
});
//すべてのデータを結合した後、ページごとに分割する
var allDayStracture = __spreadArray(__spreadArray(__spreadArray([], _diaryDayStractureBefore, true), _diaryDayStractureMain, true), _diaryDayStractureAfter, true);
$.writeln(allDayStracture.length);
var allPageStracture = (function (array) {
    var length = Math.ceil(array.length / 7);
    /*@ts-ignore*/
    var res = __spreadArray([], Array(length), true).map(function (_, i) {
        var _pageItem = array.slice(i * 7, i * 7 + 7);
        var _daiaryPageStracture = new diaryPageStracture(_pageItem);
        return _daiaryPageStracture;
    });
    return res;
})(allDayStracture);
//肩の数字の複製を作成
for (var i = 0; i < allPageStracture.length; i++) {
    var diff = 11;
    var page = app.activeDocument.pages[i * 2 + diff];
    var duplicatedSengetsu = (function (masterPageItem, to) {
        var textFrame = masterPageItem.getTextFrame("sengetsu", to);
        return formatText(textFrame);
    })(_masterItem, page);
    /*@ts-ignore*/
    duplicatedSengetsu.move([2.58, 40.5], undefined);
}
// /*@ts-ignore*/
// allPageStracture.map((v, i) => {
// 	const _diaryPageStracture = v;
// 	$.writeln(v.monthText);
// 	$.writeln(v.monthEnglishText);
// 	$.writeln("sengetsuText : " + v.sengetsuText);
// 	$.writeln("---page---");
// 	/*@ts-ignore*/
// 	v.dayStractureArray.map((t) => {
// 		$.writeln(t.youbiText);
// 		$.writeln(t.holidayText);
// 		$.writeln(t.isGlay);
// 		$.writeln("------------");
// 	});
// 	$.writeln("------------");
// });
//それぞれのページに流し込む
for (var i = 0; i < allPageStracture.length; i++) {
    var diff = 11;
    var page = app.activeDocument.pages[i * 2 + diff];
    var pageStracture = allPageStracture[i];
    var pageEntity = new diaryPageEntity(page);
    pageEntity.monthTextFrame.contents = pageStracture.monthText;
    pageEntity.monthEnglishTextFrame.contents = pageStracture.monthEnglishText;
    pageEntity.sengetsuTextFrame.contents = pageStracture.sengetsuText;
    /*@ts-ignore*/
    // pageEntity.dayEntityList.map((v, i) => {
    // 	const dayStracture = pageStracture.dayStractureArray[i];
    // });
}
