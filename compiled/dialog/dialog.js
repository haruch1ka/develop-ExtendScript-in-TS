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
export { myDialogInputTxt };
var myDialog = /** @class */ (function () {
    function myDialog(title) {
        this.obj = app.dialogs.add({ name: "".concat(title) });
        this.temp = this.obj.dialogColumns.add();
        var _input1 = new myDialogInputTxt(this.temp, "祝日 :", "");
        this.obj.show();
        _input1.getInput();
        this.input1 = _input1.input;
    }
    return myDialog;
}());
export { myDialog };
var Input = /** @class */ (function () {
    function Input(myinput) {
        var input = myinput;
        input = input.replace(new RegExp(/^[\r\n]+/gm), "");
        var regex = new RegExp(/[\r\n]+/);
        //inputに改行文字が含まれているかチェックする正規表現を使って
        /*@ts-ignore*/
        if (!regex.test(input))
            throw new Error("改行文字が含まれていません");
        var inputArr = input.split(regex); //入力を改行文字で分割
        this.inputDataArray = inputArr;
    }
    return Input;
}());
export { Input };
