"use strict";
function forloop(times, func) {
    for (var i = 0; i < times; i++) {
        func(i);
    }
}
var myDialogInputTxt = /** @class */ (function () {
    function myDialogInputTxt(targetObj, inputTitle, editText) {
        this.row = targetObj.dialogRows.add();
        var inputDiscription = this.row.dialogColumns.add();
        inputDiscription.staticTexts.add({ staticLabel: "".concat(inputTitle) });
        this.inputObj = this.row.textEditboxes.add({ editContents: "".concat(editText), minWidth: 80 });
    }
    myDialogInputTxt.prototype.getInput = function () {
        this.input = this.inputObj.editContents;
    };
    return myDialogInputTxt;
}());
var myDialogInputTxtLarge = /** @class */ (function () {
    function myDialogInputTxtLarge(targetObj, inputTitle, editText) {
        this.row = targetObj.dialogRows.add();
        var inputDiscription = this.row.dialogColumns.add();
        inputDiscription.staticTexts.add({ staticLabel: "".concat(inputTitle) });
        this.inputObj = this.row.textEditboxes.add({ editContents: "".concat(editText), minWidth: 80 });
    }
    myDialogInputTxtLarge.prototype.getInput = function () {
        this.input = this.inputObj.editContents;
    };
    return myDialogInputTxtLarge;
}());
var myDialogInputRadio = /** @class */ (function () {
    function myDialogInputRadio(targetObj, inputTitleArray) {
        this.row = targetObj.dialogRows.add();
        var inputDiscription = this.row.dialogColumns.add();
        inputDiscription.staticTexts.add({ staticLabel: "".concat(inputTitleArray) });
        this.radioObj = this.row.radiobuttonGroups.add();
        this.radioObj.radiobuttonControls.add({ staticLabel: "縦", checkedState: true });
        this.radioObj.radiobuttonControls.add({ staticLabel: "横" });
    }
    myDialogInputRadio.prototype.getInput = function () {
        this.input = this.radioObj.selectedButton;
    };
    return myDialogInputRadio;
}());
var myDialog = /** @class */ (function () {
    function myDialog(title) {
        this.obj = app.dialogs.add({ name: "".concat(title) });
        this.temp = this.obj.dialogColumns.add();
        var _input1 = new myDialogInputTxt(this.temp, "スラッシュ訳 :", "");
        this.obj.show();
        _input1.getInput();
        this.input1 = _input1.input;
    }
    return myDialog;
}());
var Input = /** @class */ (function () {
    function Input(myinput, splitRegex) {
        if (splitRegex === void 0) { splitRegex = new RegExp(/[\r\n]+/); }
        var input = myinput;
        // const regex = new RegExp(/[\r\n]+/);
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
        // $.writeln(s.type);
    }
    //入力データの処理
    var dialog = new myDialog("貼られたスラッシュ訳を流し込む");
    var input = new Input(dialog.input1);
    //先頭の数字を削除
    input.trimDataArray();
    //データの中身を"　　"で分割
    var splitedArray = [];
    var inputArray = input.getDataArray();
    forloop(inputArray.length, function (i) {
        var line = inputArray[i];
        var regex = new RegExp("　　");
        var splitedLine = new Input(line, regex).getDataArray();
        splitedArray[i] = splitedLine;
        $.writeln("splited " + splitedLine);
    });
    //アンカーオブジェクトを取得
    var _textFrames = new textFrames(app.activeDocument.selection);
    var mystory = _textFrames.getStory();
    var myAnchorItems = [];
    for (var i = 0; i < mystory.pageItems.length; i++) {
        myAnchorItems.push(mystory.pageItems[i]);
    }
    $.writeln("myAnchorItems " + myAnchorItems.length);
    //アンカーオブジェクトから□数字と
    //訳文のテキストフレームを抽出
    var myNumberTextFrames = [];
    var myTranslateTextFrames = [];
    for (var i = 0; i < mystory.pageItems.length; i++) {
        var anchorItem = myAnchorItems[i];
        switch (anchorItem.getElements()[0].constructor.name) {
            case "TextFrame":
                var textFrame = anchorItem.getElements()[0];
                // $.writeln("contents  " + textFrame.contents);
                var bounds = textFrame.geometricBounds;
                var width = bounds[3] - bounds[1];
                if (width < 5) {
                    myNumberTextFrames.push(textFrame);
                }
                else {
                    myTranslateTextFrames.push(textFrame);
                }
                break;
            case "Rectangle":
                var rectangle = anchorItem.getElements()[0];
                // rectangle.remove();
                $.writeln("rectangle  " + rectangle);
                break;
            case "Group":
                var group = anchorItem.getElements()[0];
                myNumberTextFrames.push(group.textFrames[0]);
                break;
            default:
                $.writeln(anchorItem.getElements()[0].constructor.name);
                break;
        }
    }
    $.writeln("--------------------");
    ////////////////////テキストフレームにテキストを流し込む//////////////////////////////
    $.writeln("myNumberTextFrames " + myNumberTextFrames.length);
    //頭数字のテキストフレームにテキストを流し込む
    forloop(myNumberTextFrames.length, function (i) {
        myNumberTextFrames[i].contents = (i + 1).toString();
    });
    //翻訳文をテキストフレームに流し込む
    var counter = 0;
    forloop(splitedArray.length, function (i) {
        forloop(splitedArray[i].length, function (j) {
            myTranslateTextFrames[counter].contents = splitedArray[i][j];
            // myTranslateTextFrames[counter].contents = splitedArray[i][j];
            counter++;
        });
    });
}
// function insertTranslation() {}
main();
