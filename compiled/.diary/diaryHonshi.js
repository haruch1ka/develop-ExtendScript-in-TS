var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//月ごとのテキストデータを生成するクラス
var monthText = /** @class */ (function () {
    function monthText(month, year, cal) {
        var _this = this;
        this.daysTextArray = [];
        this.pastDaysTextArray = [];
        this.youbi = cal.getYoubi(year, month, 1); //数字で曜日を取得
        /*@ts-ignore*/
        __spreadArray([], Array(cal.monthDays[month - 1]), true).map(function (_, i) { return _this.daysTextArray.push(String(i + 1)); });
    }
    return monthText;
}());
export default monthText;
