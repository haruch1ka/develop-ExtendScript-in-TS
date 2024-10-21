var diaryHonshiStocker = /** @class */ (function () {
    function diaryHonshiStocker() {
        this.daysList = [];
    }
    diaryHonshiStocker.prototype.stock = function (daysList) {
        var _this = this;
        /*@ts-ignore*/
        daysList.map(function (day) {
            _this.daysList.push(day);
        });
    };
    diaryHonshiStocker.prototype.get = function () {
        return this.daysList;
    };
    return diaryHonshiStocker;
}());
export default diaryHonshiStocker;
