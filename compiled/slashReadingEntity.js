var textFrames = /** @class */ (function () {
    function textFrames(TextFrames) {
        this.textFrames = TextFrames;
        this.contentsLength = this.textFrames.length;
    }
    textFrames.prototype.getStory = function () {
        var story;
        story = this.textFrames[0].parentStory;
        return story;
    };
    return textFrames;
}());
var slashReadingEntity = /** @class */ (function () {
    function slashReadingEntity() {
        this.myNumberTextFrames = [];
        this.myTranslateTextFrames = [];
        //アンカーオブジェクトを取得
        var _textFrames = new textFrames(app.activeDocument.selection);
        var mystory = _textFrames.getStory();
        var myAnchorItems = [];
        for (var i = 0; i < mystory.pageItems.length; i++) {
            myAnchorItems.push(mystory.pageItems[i]);
        }
        $.writeln("myAnchorItems " + myAnchorItems.length);
        for (var i = 0; i < mystory.pageItems.length; i++) {
            var anchorItem = myAnchorItems[i];
            switch (anchorItem.getElements()[0].constructor.name) {
                case "TextFrame":
                    var textFrame = anchorItem.getElements()[0];
                    // $.writeln("contents  " + textFrame.contents);
                    var bounds = textFrame.geometricBounds;
                    var width = bounds[3] - bounds[1];
                    if (width < 5) {
                        this.myNumberTextFrames.push(textFrame);
                    }
                    else {
                        this.myTranslateTextFrames.push(textFrame);
                    }
                    break;
                case "Rectangle":
                    var rectangle = anchorItem.getElements()[0];
                    // rectangle.remove();
                    $.writeln("rectangle  " + rectangle);
                    break;
                case "Group":
                    var group = anchorItem.getElements()[0];
                    this.myNumberTextFrames.push(group.textFrames[0]);
                    break;
                default:
                    $.writeln(anchorItem.getElements()[0].constructor.name);
                    break;
            }
        }
        $.writeln("--------------------");
    }
    return slashReadingEntity;
}());
export { slashReadingEntity };
