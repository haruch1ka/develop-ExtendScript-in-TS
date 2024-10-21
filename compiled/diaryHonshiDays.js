var diaryHonshiDays = /** @class */ (function () {
    function diaryHonshiDays() {
        this.daysList = [];
    }
    diaryHonshiDays.prototype.stock = function (daysList) {
        var _this = this;
        /*@ts-ignore*/
        daysList.map(function (day) {
            _this.daysList.push(day);
        });
    };
    diaryHonshiDays.prototype.get = function () {
        return this.daysList;
    };
    return diaryHonshiDays;
}());
export default diaryHonshiDays;
