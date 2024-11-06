var diaryDayEntity = /** @class */ (function () {
    function diaryDayEntity(dayIndex, TextFrames) {
        this.dayIndex = dayIndex;
        this.dayTextFrame = TextFrames.itemByName("niti" + dayIndex);
        this.weekTextFrame = TextFrames.itemByName("you" + dayIndex);
        this.rokuyouTextFrame = TextFrames.itemByName("roku" + dayIndex);
        this.holidayTextFrame = TextFrames.itemByName("shuk" + dayIndex);
    }
    return diaryDayEntity;
}());
export { diaryDayEntity };
export default diaryDayEntity;
