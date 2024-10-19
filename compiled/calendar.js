var calendar = /** @class */ (function () {
    function calendar(year) {
        this.year = year;
        this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 月の日数
        if (this.isLeapYear())
            this.monthDays[1] = 29; // うるう年
    }
    calendar.prototype.isLeapYear = function () {
        if (this.year % 400 === 0)
            return true;
        if (this.year % 100 === 0)
            return false;
        if (this.year % 4 === 0)
            return true;
        return false;
    };
    calendar.prototype.getYoubi = function (year, month, day) {
        var d = new Date(year, month - 1, day);
        return d.getDay();
    };
    calendar.prototype.getMonthText = function (year, month) {
        var youbi = this.getYoubi(year, month, 1);
    };
    return calendar;
}());
export default calendar;
