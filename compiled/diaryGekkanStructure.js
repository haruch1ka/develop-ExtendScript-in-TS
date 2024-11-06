var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var diaryGekkanDayStructure = /** @class */ (function () {
    function diaryGekkanDayStructure(daytext, weektext, holidaytext, monthtext, yeartext) {
        this.dayText = daytext;
        this.weekText = weektext;
        this.holidayText = holidaytext;
        this.monthText = monthtext;
        this.yearText = yeartext;
        this.isHoliday = false;
        this.isSaturday = false;
        this.isSunday = false;
    }
    return diaryGekkanDayStructure;
}());
export { diaryGekkanDayStructure };
var diaryGekkanPageStructure = /** @class */ (function () {
    function diaryGekkanPageStructure(dayStructureArray) {
        this.yearText = "";
        this.monthText = "";
        this.leftPageHolidayArray = [];
        this.rightPageHolidayArray = [];
        this.leftPageSaturdayArray = [];
        this.rightPageSaturdayArray = [];
        this.dayStructureArray = dayStructureArray;
        this.yearText = dayStructureArray[0].yearText;
        this.monthText = dayStructureArray[0].monthText;
        for (var i = 0; i < dayStructureArray.length; i++) {
            if (i >= 0 && i < 16) {
                dayStructureArray[i].isHoliday || dayStructureArray[i].isSunday
                    ? this.leftPageHolidayArray.push(true)
                    : this.leftPageHolidayArray.push(false);
                dayStructureArray[i].isSaturday ? this.leftPageSaturdayArray.push(true) : this.leftPageSaturdayArray.push(false);
            }
            else if (i >= 16) {
                dayStructureArray[i].isHoliday || dayStructureArray[i].isSunday
                    ? this.rightPageHolidayArray.push(true)
                    : this.rightPageHolidayArray.push(false);
                dayStructureArray[i].isSaturday ? this.rightPageSaturdayArray.push(true) : this.rightPageSaturdayArray.push(false);
            }
        }
    }
    return diaryGekkanPageStructure;
}());
export { diaryGekkanPageStructure };
export var getTextframeIndex = function (from, to, index) {
    /*@ts-ignore*/
    var txtFrameArray = __spreadArray([], Array(to - from + 1), true).map(function (_, i) { return from + i + 1; });
    var tarArray = txtFrameArray
        /*@ts-ignore*/
        .map(function (v) { return v.toString().length + 1; });
    var res = tarArray
        /*@ts-ignore*/
        .map(function (v, i) { return [tarArray.slice(0, i + 1).reduce(function (acc, cur) { return acc + cur; }) - 1, v]; });
    return res[index];
};
