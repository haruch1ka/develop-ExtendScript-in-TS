var slashReadingEntity = /** @class */ (function () {
    function slashReadingEntity() {
        var _this = this;
        this.myNumberTextFrames = [];
        this.myTranslateTextFrames = [];
        /*@ts-ignore*/
        var mystory = app.activeDocument.selection[0].parentStory;
        /*@ts-ignore*/
        var myAnchorItems = mystory.pageItems.map(function (item) { return item; });
        myAnchorItems.forEach(function (anchorItem) {
            var element = anchorItem.getElements()[0];
            switch (element.constructor.name) {
                case "TextFrame":
                    _this.processTextFrame(element);
                    break;
                case "Group":
                    _this.processGroup(element);
                    break;
                default:
                    $.writeln("想定外のオブジェクトです " + element.constructor.name);
                    break;
            }
        });
        $.writeln("--------------------");
    }
    slashReadingEntity.prototype.processTextFrame = function (textFrame) {
        var bounds = textFrame.geometricBounds;
        var width = bounds[3] - bounds[1];
        width < 5 ? this.myNumberTextFrames.push(textFrame) : this.myTranslateTextFrames.push(textFrame);
    };
    slashReadingEntity.prototype.processGroup = function (group) {
        this.myNumberTextFrames.push(group.textFrames[0]);
    };
    return slashReadingEntity;
}());
export { slashReadingEntity };
