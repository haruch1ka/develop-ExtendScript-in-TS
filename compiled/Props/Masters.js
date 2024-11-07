var Masters = /** @class */ (function () {
    function Masters(pageNum) {
        this.master = app.activeDocument.masterSpreads[pageNum];
        $.writeln(this.master.name);
    }
    Masters.prototype.getTextFrame = function (name, to) {
        var textFrame = this.master.textFrames.itemByName(name);
        var duplicatedItem = textFrame.duplicate(to, [0, 0]);
        return duplicatedItem;
    };
    return Masters;
}());
export { Masters };
export default Masters;
