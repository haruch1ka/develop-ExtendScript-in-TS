var diaryCalenderPageEntity = /** @class */ (function () {
    function diaryCalenderPageEntity(page) {
        var _this = this;
        var sundayNameList = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
        var saturdayNameList = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];
        this.textFrames = page.textFrames;
        /*@ts-ignore*/
        this.sundayItemList = sundayNameList.map(function (name) { return _this.textFrames.itemByName(name); });
        /*@ts-ignore*/
        this.saturdayItemList = saturdayNameList.map(function (name) { return _this.textFrames.itemByName(name); });
    }
    diaryCalenderPageEntity.prototype.getByName = function (name) {
        return this.textFrames.itemByName(name);
    };
    return diaryCalenderPageEntity;
}());
export { diaryCalenderPageEntity };
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
