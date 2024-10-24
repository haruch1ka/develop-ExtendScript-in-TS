var diaryPageStracture = /** @class */ (function () {
    function diaryPageStracture(dayStractureArray) {
        var first = dayStractureArray[0];
        var last = dayStractureArray[6];
        var isMonthTextDifferent = first.monthText !== last.monthText ? true : false;
        var isLastGlay = last.isGlay ? true : false;
        var isSengetsu = isMonthTextDifferent && !isLastGlay ? true : false;
        this.dayStractureArray = dayStractureArray;
        this.monthText = !isLastGlay ? last.monthText : dayStractureArray[0].monthText;
        this.monthEnglishText = this.getEng(last.monthText);
        this.sengetsuText = isSengetsu ? first.monthText + "/" : "";
    }
    diaryPageStracture.prototype.getEng = function (string) {
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
    return diaryPageStracture;
}());
export { diaryPageStracture };
var diaryDayStracture = /** @class */ (function () {
    function diaryDayStracture(data) {
        this.monthText = data[2];
        this.youbiText = data[6];
        this.holidayText = data[7];
        this.isGlay = false;
    }
    diaryDayStracture.prototype.setGlayActivate = function () {
        this.isGlay = true;
    };
    return diaryDayStracture;
}());
export { diaryDayStracture };
