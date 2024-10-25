var diaryPageStructure = /** @class */ (function () {
    function diaryPageStructure(dayStructureArray) {
        var first = dayStructureArray[0];
        var last = dayStructureArray[6];
        var isMonthTextDifferent = first.monthText !== last.monthText ? true : false;
        var isLastGlay = last.isGlay ? true : false;
        var isSengetsu = isMonthTextDifferent && !isLastGlay ? true : false;
        this.dayStructureArray = dayStructureArray;
        this.monthText = !isLastGlay ? last.monthText : dayStructureArray[0].monthText;
        this.monthEnglishText = this.getEng(last.monthText);
        this.sengetsuText = isSengetsu ? first.monthText + "/" : "";
    }
    diaryPageStructure.prototype.getEng = function (string) {
        var monthEnglishTextList = {
            "1": "January",
            "2": "February",
            "3": "March",
            "4": "April",
            "5": "May",
            "6": "June",
            "7": "July",
            "8": "August",
            "9": "September",
            "10": "October",
            "11": "November",
            "12": "December",
        };
        return monthEnglishTextList[string];
    };
    return diaryPageStructure;
}());
export { diaryPageStructure };
var diaryDayStructure = /** @class */ (function () {
    function diaryDayStructure(data) {
        this.monthText = data[2];
        this.youbiText = data[6];
        this.holidayText = data[7];
        this.isGlay = false;
    }
    diaryDayStructure.prototype.setGlayActivate = function () {
        this.isGlay = true;
    };
    return diaryDayStructure;
}());
export { diaryDayStructure };
