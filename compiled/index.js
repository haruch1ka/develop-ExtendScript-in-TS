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
import { diaryPageStructure, diaryDayStructure } from "./diaryPageStructure";
import myMasterPageItem from "./Props/myMasterItem";
import { formatText, changeCharacterStyle, changeParagraphStyle } from "./Props/TextFrameWrapper";
import Styles from "./Props/Styles";
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
var monthLength = cal.getMonthLength(1, 3, year);
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
var _diaryDayStructureBefore = beforeData.map(function (v) {
    var _instance = new diaryDayStructure(v);
    _instance.setGlayActivate();
    return _instance;
});
/*@ts-ignore*/
var _diaryDayStructureMain = mainData.map(function (v) {
    return new diaryDayStructure(v);
});
/*@ts-ignore*/
var _diaryDayStructureAfter = afterData.map(function (v) {
    var _instance = new diaryDayStructure(v);
    _instance.setGlayActivate();
    return _instance;
});
//すべてのデータを結合した後、ページごとに分割する
var allDayStructure = __spreadArray(__spreadArray(__spreadArray([], _diaryDayStructureBefore, true), _diaryDayStructureMain, true), _diaryDayStructureAfter, true);
$.writeln(allDayStructure.length);
var allPageStructure = (function (array) {
    var length = Math.ceil(array.length / 7);
    /*@ts-ignore*/
    var res = __spreadArray([], Array(length), true).map(function (_, i) {
        var _pageItem = array.slice(i * 7, i * 7 + 7);
        var _daiaryPageStructure = new diaryPageStructure(_pageItem);
        return _daiaryPageStructure;
    });
    return res;
})(allDayStructure);
//肩の数字の複製を作成
for (var i = 0; i < allPageStructure.length; i++) {
    var diff = 11;
    var page = app.activeDocument.pages[i * 2 + diff];
    var duplicatedSengetsu = (function (masterPageItem, to) {
        var textFrame = masterPageItem.getTextFrame("sengetsu", to);
        return formatText(textFrame);
    })(_masterItem, page);
    /*@ts-ignore*/
    duplicatedSengetsu.move([2.58, 40.5], undefined);
}
//スタイルを取得
var characterStyles = new Styles(app.activeDocument.characterStyles);
var paragraphStyles = new Styles(app.activeDocument.paragraphStyles);
var p_style_left_up = paragraphStyles.getStyle("日毎予定表_左肩数字");
var c_style_glay = characterStyles.getStyle("Black30");
var c_style_sat = characterStyles.getStyle("aka50");
var c_style_sun = characterStyles.getStyle("aka100");
$.writeln(p_style_left_up.name);
var _loop_1 = function (i) {
    var diff = 11;
    var page = app.activeDocument.pages[i * 2 + diff];
    var pageStructure = allPageStructure[i];
    var pageEntity = new diaryPageEntity(page);
    pageEntity.monthTextFrame.contents = pageStructure.monthText;
    pageEntity.monthEnglishTextFrame.contents = pageStructure.monthEnglishText;
    pageEntity.sengetsuTextFrame.contents = pageStructure.sengetsuText;
    changeParagraphStyle(pageEntity.sengetsuTextFrame, p_style_left_up);
    if (pageStructure.sengetsuText !== "" && pageStructure.dayStructureArray[0].isGlay) {
        changeCharacterStyle(pageEntity.sengetsuTextFrame, c_style_glay);
    }
    //スタイルを条件に応じて適用する
    /*@ts-ignore*/
    pageEntity.dayEntityList.map(function (v, j) {
        var dayStructure = pageStructure.dayStructureArray[j];
        var isHoliday = dayStructure.holidayText !== "";
        if (dayStructure.isGlay) {
            changeCharacterStyle(v.dayTextFrame, c_style_glay);
            changeCharacterStyle(v.weekTextFrame, c_style_glay);
            changeCharacterStyle(v.rokuyouTextFrame, c_style_glay);
        }
        else {
            if (dayStructure.youbiText === "土") {
                changeCharacterStyle(v.weekTextFrame, c_style_sat);
                if (!isHoliday) {
                    changeCharacterStyle(v.dayTextFrame, c_style_sat);
                }
                else {
                    changeCharacterStyle(v.dayTextFrame, c_style_sun);
                }
            }
            else if (dayStructure.youbiText === "日") {
                changeCharacterStyle(v.weekTextFrame, c_style_sun);
                changeCharacterStyle(v.dayTextFrame, c_style_sun);
            }
            else {
                if (isHoliday) {
                    changeCharacterStyle(v.dayTextFrame, c_style_sun);
                }
            }
        }
    });
};
//それぞれのページに流し込む/スタイルを適用する
for (var i = 0; i < allPageStructure.length; i++) {
    _loop_1(i);
}
