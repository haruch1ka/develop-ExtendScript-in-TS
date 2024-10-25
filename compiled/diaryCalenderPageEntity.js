var diaryCalenderPageEntity = /** @class */ (function () {
    function diaryCalenderPageEntity(page) {
        var allNameList = [
            "txf1a",
            "txf1b",
            "txf1c",
            "txf1d",
            "txf1e",
            "txf1f",
            "txf1g",
            "txf2a",
            "txf2b",
            "txf2c",
            "txf2d",
            "txf2e",
            "txf2f",
            "txf2g",
            "txf3a",
            "txf3b",
            "txf3c",
            "txf3d",
            "txf3e",
            "txf3f",
            "txf3g",
            "txf4a",
            "txf4b",
            "txf4c",
            "txf4d",
            "txf4e",
            "txf4f",
            "txf4g",
            "txf5a",
            "txf5b",
            "txf5c",
            "txf5d",
            "txf5e",
            "txf5f",
            "txf5g",
        ];
        var textFrames = page.textFrames;
        /*@ts-ignore*/
        this.allDayEntityArray = allNameList.map(function (_, i) {
            return textFrames.itemByName(allNameList[i]);
        });
    }
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
