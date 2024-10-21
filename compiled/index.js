var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import calendar from "./calendar";
import polyfill from "./polyfill/polyfill";
import diaryHonshiDays from "./diaryHonshiDays";
polyfill();
var year = 2026;
var cal = new calendar();
var _diaryHonshiDays = new diaryHonshiDays(); //diaryHonshiDaysクラスのインスタンスを生成する。
var youbiToDaysGap = { "0": 6, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }; //0:日曜日,1:月曜日,2:火曜日,3:水曜日,4:木曜日,5:金曜日,6:土曜日
//1~12月までの日にちを取得して、diaryHonshiDaysクラスのインスタンスに格納する。
for (var i = 0; i < cal.monthDays.length; i++) {
    /*@ts-ignore*/
    var monthArray = cal.getMonthDays(year, i + 1).map(function (v) { return v.toString(); });
    _diaryHonshiDays.stock(monthArray);
}
//曜日に応じて、前年度の日にちを取得する。
var createMarchArray = function () {
    var youbiNum = cal.getYoubi(year, 4, 1);
    var gap = youbiToDaysGap[youbiNum];
    var march = cal.getMonthDays(year - 1, 3);
    $.writeln(youbiNum);
    $.writeln(gap);
    $.writeln(march);
    /*@ts-ignore*/
    var marchArray = __spreadArray([], Array(gap), true).map(function (_, i) { return march[march.length - (gap - i)]; });
    return marchArray;
};
$.writeln(createMarchArray());
//日にちの配列を生成。
