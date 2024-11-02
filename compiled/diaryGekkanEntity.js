var diaryGekkanPageEntity = /** @class */ (function () {
    function diaryGekkanPageEntity(page) {
        var textFrames = page.textFrames;
        this.monthTextFrame = textFrames.itemByName("tuki");
        this.yearTextFrame = textFrames.itemByName("nen");
        $.writeln(this.monthTextFrame);
        $.writeln(this.yearTextFrame);
    }
    return diaryGekkanPageEntity;
}());
export { diaryGekkanPageEntity };
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
