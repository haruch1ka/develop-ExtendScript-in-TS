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
        this.monthHolidayArray = [];
        this.dayStructureArray = dayStructureArray;
        this.yearText = dayStructureArray[0].yearText;
        this.monthText = dayStructureArray[0].monthText;
        for (var i = 0; i < dayStructureArray.length; i++) {
            if (dayStructureArray[i].isHoliday) {
                this.monthHolidayArray.push(true);
            }
            else {
                this.monthHolidayArray.push(false);
            }
        }
    }
    return diaryGekkanPageStructure;
}());
export { diaryGekkanPageStructure };
