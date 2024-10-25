var diaryCalenderDayStructure = /** @class */ (function () {
    //祝日かどうか
    function diaryCalenderDayStructure(daytext) {
        this.dayText = daytext;
        this.isHoliday = false;
        this.isSeparated = false;
        this.isSunday = false;
        this.isSaturday = false;
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
