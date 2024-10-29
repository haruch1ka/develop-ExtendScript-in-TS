var diaryCalenderDayStructure = /** @class */ (function () {
    function diaryCalenderDayStructure(daytext, aftertext) {
        if (aftertext === void 0) { aftertext = ""; }
        this.dayText = daytext;
        this.afterText = aftertext;
        this.isHoliday = false;
        this.isSeparated = false;
        this.isSunday = false;
        this.isSaturday = false;
        this.isDot = false;
        this.isLeftHoliday = false;
        this.isRightHoliday = false;
    }
    return diaryCalenderDayStructure;
}());
export { diaryCalenderDayStructure };
var diaryCalenderPageStructure = /** @class */ (function () {
    function diaryCalenderPageStructure(dayStructureArray) {
        this.dayStructureArray = dayStructureArray;
    }
    return diaryCalenderPageStructure;
}());
export { diaryCalenderPageStructure };
