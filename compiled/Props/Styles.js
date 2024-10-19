//スタイル管理のクラス
var Styles = /** @class */ (function () {
    function Styles(styles) {
        this.doc = app.activeDocument;
        this.styles = styles;
    }
    Styles.prototype.getStyle = function (name) {
        for (var i = 0; i < this.styles.length; i++) {
            if (this.styles[i].name === name)
                return this.styles[i];
        }
    };
    Styles.prototype.disp = function () {
        for (var i = 0; i < this.styles.length; i++) {
            $.writeln(this.styles[i].name);
        }
    };
    return Styles;
}());
export default Styles;
