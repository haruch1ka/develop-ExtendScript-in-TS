var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import diaryDayEntity from "./diaryDayEntity";
var diaryPageEntity = /** @class */ (function () {
    function diaryPageEntity(page) {
        var textFrames = page.textFrames;
        this.sengetsuTextFrame = textFrames.itemByName("sengetsu");
        this.monthTextFrame = textFrames.itemByName("tuki");
        this.monthEnglishTextFrame = textFrames.itemByName("tukieng");
        /*@ts-ignore*/
        this.dayEntityList = __spreadArray([], Array(7), true).map(function (_, i) {
            return new diaryDayEntity(i + 1, textFrames);
        });
    }
    return diaryPageEntity;
}());
export { diaryPageEntity };
var firstPageEntity = /** @class */ (function () {
    function firstPageEntity(page) {
        this.page = page;
        var textFrames = page.textFrames;
        var dayItem = textFrames.itemByName("txf1a");
        this.dayStory = dayItem.parentStory;
        this.dayInsertionPoint = dayItem.insertionPoints[0];
    }
    return firstPageEntity;
}());
export { firstPageEntity };
