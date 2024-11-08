// スラッシュ訳を流し込むスクリプト
// UTF-8 with BOM で保存されるか確認すること
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import polyfill from "./polyfill/polyfill";
import { myDialog } from "./dialog/dialog";
polyfill();
var Selection = /** @class */ (function () {
    function Selection() {
        this.length = 0;
        this.type = "";
        var obj = app.activeDocument.selection;
        this.length = obj.length;
        this.type = obj.length > 0 ? obj[0].constructor.name : "";
    }
    return Selection;
}());
var slashReadingEntity = /** @class */ (function () {
    function slashReadingEntity(textframe) {
        var _this = this;
        this.myNumberTextFrames = [];
        this.myTranslateTextFrames = [];
        /*@ts-ignore*/
        var mystory = textframe.parentStory;
        /*@ts-ignore*/
        var myAnchorItems = __spreadArray([], mystory.pageItems, true);
        /*@ts-ignore*/
        myAnchorItems.map(function (anchorItem) {
            var element = anchorItem.getElements()[0];
            switch (element.constructor.name) {
                case "TextFrame":
                    _this.processTextFrame(element);
                    break;
                case "Group":
                    _this.processGroup(element);
                    break;
                case "Rectangle":
                    _this.processRectangle(element);
                    break;
                default:
                    $.writeln("想定外のオブジェクトです " + element.constructor.name);
                    break;
            }
        });
    }
    slashReadingEntity.prototype.processTextFrame = function (textFrame) {
        var bounds = textFrame.geometricBounds;
        var width = bounds[3] - bounds[1];
        width < 5 ? this.myNumberTextFrames.push(textFrame) : this.myTranslateTextFrames.push(textFrame);
    };
    slashReadingEntity.prototype.processGroup = function (group) {
        this.myNumberTextFrames.push(group.textFrames[0]);
    };
    slashReadingEntity.prototype.processRectangle = function (rectangle) {
        //何もしない
    };
    return slashReadingEntity;
}());
function main() {
    ///////////////////////////
    // データの取得
    ///////////////////////////
    var s = new Selection();
    if (s.length <= 0)
        return alert("何も選択されていません テキストフレームを選択してください");
    if (s.length !== 1 || s.type !== "TextFrame")
        return alert("テキストフレームを1つ選択してください");
    var dialog = new myDialog("貼られたスラッシュ訳を流し込む");
    ///////////////////////////
    // データの加工
    ///////////////////////////
    var splitString = function (input, splitRegex) {
        if (splitRegex === void 0) { splitRegex = new RegExp(/[\r\n]+/); }
        /*@ts-ignore*/
        return input.split(splitRegex).map(function (line) { return line.replace(/^\s+/, ""); }); //入力を改行文字で分割
    };
    //入力されたテキストの最初の文字を削除（行頭の数字を削除）
    /*@ts-ignore*/
    var inputArray = splitString(dialog.input1).map(function (line, i) {
        var regex = !(i + 1 >= 10) ? new RegExp("^.{1}") : new RegExp("^.{2}");
        return line.replace(regex, "");
    });
    //データの中身を"　　"で分割
    /*@ts-ignore*/
    var splitedArray = inputArray.map(function (line) { return splitString(line, new RegExp("　　")); });
    ///////////////////////////
    // エンティティの取得
    ///////////////////////////
    /*@ts-ignore*/
    var _slashReadingEntity = new slashReadingEntity(app.activeDocument.selection[0]);
    ///////////////////////////
    // データの流し込み
    ///////////////////////////
    //頭数字のテキストフレームにテキストを流し込む
    var paragraphNumberLen = _slashReadingEntity.myNumberTextFrames.length;
    for (var i = 0; i < paragraphNumberLen; i++) {
        _slashReadingEntity.myNumberTextFrames[i].contents = (i + 1).toString();
    }
    //翻訳文をテキストフレームに流し込む
    var counter = 0;
    for (var i = 0; i < splitedArray.length; i++) {
        for (var j = 0; j < splitedArray[i].length; j++) {
            $.writeln([i, j] + " : " + "[i, j]");
            $.writeln(counter + " : " + "counter");
            _slashReadingEntity.myTranslateTextFrames[counter].contents = splitedArray[i][j];
            counter++;
        }
    }
}
main();
