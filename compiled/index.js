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
polyfill();
var diary = new diaryInputData();
var cal = new calendar();
var year = parseInt(diary.data[1][1]);
var youbiToDaysGap = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日
//曜日に応じて、前年度の日にちを取得する。
var getBeforeGap = function (year) {
    var youbiNum = cal.getYoubi(year, 4, 1);
    $.writeln("youbiNum:" + youbiNum);
    var gap = youbiToDaysGap[youbiNum];
    return gap;
};
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
var monthLength = cal.getMonthLength(1, 3);
//すべてのデータを取得
var beforeData = diary.data.slice(monthLength - beforeGap, monthLength);
var mainData = diary.data.slice(monthLength + 1, monthLength + yearLength + 1);
var afterData = diary.data.slice(monthLength + yearLength + 1, monthLength + yearLength + AfterGap + 1);
/*@ts-ignore*/
var daysText = __spreadArray(__spreadArray(__spreadArray([], beforeData.map(function (v) { return v[3]; }), true), mainData.map(function (v) { return v[3]; }), true), afterData.map(function (v) { return v[3]; }), true);
$.writeln(daysText);
