var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var calendar = /** @class */ (function () {
    function calendar() {
        this.weekNameList = { "0": "日", "1": "月", "2": "火", "3": "水", "4": "木", "5": "金", "6": "土" };
        this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 月の日数
    }
    calendar.prototype.isLeapYear = function (year) {
        if (year % 400 === 0)
            return true;
        if (year % 100 === 0)
            return false;
        if (year % 4 === 0)
            return true;
        return false;
    };
    calendar.prototype.changeLeapYear = function (year) {
        if (this.isLeapYear(year))
            this.monthDays[1] = 29; // うるう年
    };
    calendar.prototype.getYoubi = function (year, month, day) {
        this.changeLeapYear(year);
        var d = new Date(year, month - 1, day);
        return d.getDay();
    };
    calendar.prototype.getMonthDays = function (year, month) {
        this.changeLeapYear(year);
        /*@ts-ignore*/
        return __spreadArray([], Array(this.monthDays[month - 1]), true).map(function (_, i) { return i + 1; });
    };
    calendar.prototype.getMonthLength = function (from, to, year) {
        this.changeLeapYear(year);
        if (from > to)
            throw new Error("from is bigger than to");
        if (from < 1 || from > 12)
            throw new Error("from is out of range");
        var monthLength = 0;
        for (var i = from - 1; i < to; i++) {
            monthLength += this.monthDays[i];
        }
        return monthLength;
    };
    calendar.prototype.getMonthDaysLengths = function (year) {
        this.changeLeapYear(year);
        return this.monthDays;
    };
    return calendar;
}());
export default calendar;
