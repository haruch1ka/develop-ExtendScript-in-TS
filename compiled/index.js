//概要
//ストーリー上のルビの比率を変更するスクリプト
//うまく動作しないときには　"UTF-8 with BOM" で保存されているか確認すること
//
import polyfill from "./polyfill/polyfill";
import { myDialog } from "./dialog/dialog";
import { slashReadingEntity } from "./slashReadingEntity";
polyfill();
function forloop(times, func) {
    for (var i = 0; i < times; i++) {
        func(i);
    }
}
var Input = /** @class */ (function () {
    function Input(myinput, splitRegex) {
        if (splitRegex === void 0) { splitRegex = new RegExp(/[\r\n]+/); }
        var input = myinput;
        var regex = splitRegex;
        var inputArr = input.split(regex); //入力を改行文字で分割
        for (var i = 0; i < inputArr.length; i++) {
            //行頭の空白を削除
            inputArr[i] = inputArr[i].replace(/^\s+/, "");
        }
        this.inputDataArray = inputArr;
    }
    Input.prototype.getDataArray = function () {
        return this.inputDataArray;
    };
    Input.prototype.trimDataArray = function () {
        var _this = this;
        forloop(this.inputDataArray.length, function (i) {
            var regex = new RegExp("^.{1}");
            if (i + 1 >= 10)
                regex = new RegExp("^.{2}");
            var line = _this.inputDataArray[i].replace(regex, "");
            _this.inputDataArray[i] = line;
        });
    };
    return Input;
}());
var Selection = /** @class */ (function () {
    function Selection() {
        this.type = "";
        this.is_selected = false;
        this.is_one = false;
        this.obj = app.activeDocument.selection;
        this.isSelected();
        if (this.is_selected) {
            this.gettype();
        }
    }
    Selection.prototype.gettype = function () {
        this.type = this.obj[0].constructor.name;
    };
    Selection.prototype.isSelected = function () {
        if (this.obj.length !== 0) {
            this.is_selected = true;
            this.is_one = this.isOne();
        }
        else {
            this.is_selected = false;
        }
    };
    Selection.prototype.isOne = function () {
        return this.obj.length === 1;
    };
    return Selection;
}());
function main() {
    var s = new Selection();
    // $.writeln(s.is_selected); //選択されているか？
    if (!s.is_selected) {
        alert("テキストフレームを選択してください");
        return;
    }
    if (!s.is_one) {
        alert("テキストフレームを1つ選択してください");
        return;
    }
    s.gettype();
    if (s.type !== "TextFrame") {
        alert("テキストフレームを選択してください");
        return;
    }
    else {
        $.writeln(s.type);
    }
    //入力データの処理
    var dialog = new myDialog("貼られたスラッシュ訳を流し込む");
    var dataArranging = function (input) {
        var _input = new Input(input);
        //先頭の数字を削除
        _input.trimDataArray();
        return _input.getDataArray();
    };
    //データの中身を"　　"で分割
    var inputArray = dataArranging(dialog.input1);
    var splitedArray = [];
    forloop(inputArray.length, function (i) {
        var line = inputArray[i];
        var regex = new RegExp("　　");
        var splitedLine = new Input(line, regex).getDataArray();
        splitedArray[i] = splitedLine;
        $.writeln("splited " + splitedLine);
    });
    var _slashReadingEntity = new slashReadingEntity();
    ////////////////////テキストフレームにテキストを流し込む//////////////////////////////
    //頭数字のテキストフレームにテキストを流し込む
    forloop(_slashReadingEntity.myNumberTextFrames.length, function (i) {
        _slashReadingEntity.myNumberTextFrames[i].contents = (i + 1).toString();
    });
    //翻訳文をテキストフレームに流し込む
    var counter = 0;
    forloop(splitedArray.length, function (i) {
        forloop(splitedArray[i].length, function (j) {
            _slashReadingEntity.myTranslateTextFrames[counter].contents = splitedArray[i][j];
            counter++;
        });
    });
}
main();
