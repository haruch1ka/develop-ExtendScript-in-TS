var myMasterPageItem = /** @class */ (function () {
    function myMasterPageItem(pageNum) {
        this.master = app.activeDocument.masterSpreads[pageNum];
        $.writeln(this.master.name);
    }
    myMasterPageItem.prototype.getTextFrame = function (name, to) {
        var textFrame = this.master.textFrames.itemByName(name);
        var duplicatedItem = textFrame.duplicate(to, [0, 0]);
        return duplicatedItem;
    };
    return myMasterPageItem;
}());
export { myMasterPageItem };
export default myMasterPageItem;
