var diaryGekkanEvenPageEntity = /** @class */ (function () {
    function diaryGekkanEvenPageEntity(page) {
        var textFrames = page.textFrames;
        this.monthTextFrame = textFrames.itemByName("tuki");
        this.dayTextFrame = textFrames.itemByName("niti1");
    }
    return diaryGekkanEvenPageEntity;
}());
export { diaryGekkanEvenPageEntity };
var diaryGekkanOddPageEntity = /** @class */ (function () {
    function diaryGekkanOddPageEntity(page) {
        var textFrames = page.textFrames;
        this.yearTextFrame = textFrames.itemByName("nen");
    }
    return diaryGekkanOddPageEntity;
}());
export { diaryGekkanOddPageEntity };
var firstPageEntity = /** @class */ (function () {
    function firstPageEntity(page) {
        this.page = page;
        var textFrames = page.textFrames;
        var dayItem = textFrames.itemByName("niti1");
        var weekItem = textFrames.itemByName("you1");
        var holidayItem = textFrames.itemByName("shuk1");
        this.dayStory = dayItem.parentStory;
        this.weekStory = weekItem.parentStory;
        this.holidayStory = holidayItem.parentStory;
        this.dayInsertionPoint = dayItem.insertionPoints[0];
    }
    return firstPageEntity;
}());
export { firstPageEntity };
