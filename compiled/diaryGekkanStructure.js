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
        this.dayStructureArray = dayStructureArray;
        this.yearText = dayStructureArray[0].yearText;
        this.monthText = dayStructureArray[0].monthText;
        for (var i = 0; i < dayStructureArray.length; i++) {
            if (i > 0 && i < 16) {
                dayStructureArray[i].isHoliday ? this.leftPageHolidayArray.push(true) : this.leftPageHolidayArray.push(false);
            }
            else if (i >= 16) {
                dayStructureArray[i].isHoliday ? this.rightPageHolidayArray.push(true) : this.rightPageHolidayArray.push(false);
            }
        }
    }
    return diaryGekkanPageStructure;
}());
export { diaryGekkanPageStructure };
