"use strict";
function forloop(times, func) {
    for (var i = 0; i < times; i++) {
        func(i);
    }
}
var myExcel = /** @class */ (function () {
    function myExcel(excelFilePath, splitChar, sheetNumber) {
        this.excelFilePath = excelFilePath;
        this.splitChar = splitChar;
        this.sheetNumber = sheetNumber;
    }
    myExcel.prototype.GetDataFromExcelPC = function () {
        try {
            if (typeof this.splitChar === "undefined")
                this.splitChar = ";";
            if (typeof this.sheetNumber === "undefined")
                this.sheetNumber = "1";
            var appVersionNum = Number(String(app.version).split(".")[0]), data = [];
            var vbs = "Public s, excelFilePath\r";
            vbs += "Function ReadFromExcel()\r";
            vbs += "On Error Resume Next\r";
            vbs += "Err.Clear\r";
            vbs += 'Set objExcel = CreateObject("Excel.Application")\r';
            vbs += 'Set objBook = objExcel.Workbooks.Open("' + this.excelFilePath + '")\r';
            vbs += "Set objSheet =  objExcel.ActiveWorkbook.WorkSheets(" + this.sheetNumber + ")\r";
            vbs += 's = s & "[" & objSheet.Name & "]"\r';
            vbs += "objExcel.Visible = True\r";
            vbs += "matrix = objSheet.UsedRange\r";
            vbs += "maxDim0 = UBound(matrix, 1)\r";
            vbs += "maxDim1 = UBound(matrix, 2)\r";
            vbs += "For i = 1 To maxDim0\r";
            vbs += "For j = 1 To 3\r";
            vbs += "If j = maxDim1 Then\r";
            vbs += "s = s & matrix(i, j)\r";
            vbs += "Else\r";
            vbs += 's = s & matrix(i, j) & "' + this.splitChar + '"\r';
            vbs += "End If\r";
            vbs += "Next\r";
            vbs += "s = s & vbCr\r";
            vbs += "Next\r";
            vbs += "objBook.Close\r";
            vbs += "Set objSheet = Nothing\r";
            vbs += "Set objBook = Nothing\r";
            vbs += "Set objExcel = Nothing\r";
            vbs += "SetArgValue()\r";
            vbs += "On Error Goto 0\r";
            vbs += "End Function\r";
            vbs += "Function SetArgValue()\r";
            vbs += 'Set objInDesign = CreateObject("InDesign.Application")\r';
            vbs += 'objInDesign.ScriptArgs.SetValue "excel_data", s\r';
            vbs += "End Function\r";
            vbs += "ReadFromExcel()\r";
            if (appVersionNum > 5) {
                // CS4 and above
                app.doScript(vbs, ScriptLanguage.VISUAL_BASIC, undefined, UndoModes.FAST_ENTIRE_SCRIPT);
            }
            else {
                // CS3 and below
                app.doScript(vbs, ScriptLanguage.VISUAL_BASIC);
            }
            var str = app.scriptArgs.getValue("excel_data");
            app.scriptArgs.clear();
            var tempArrLine = void 0, line = void 0, match = void 0, name = void 0, tempArrData = str.split("\r");
            for (var i = 0; i < tempArrData.length; i++) {
                line = tempArrData[i];
                if (line == "")
                    continue;
                match = line.match(/^\[.+\]/);
                if (match != null) {
                    name = match[0].replace(/\[|\]/g, "");
                    line = line.replace(/^\[.+\]/, "");
                }
                tempArrLine = line.split(this.splitChar);
                data.name = name;
                data.push(tempArrLine);
            }
            return data;
        }
        catch (err) {
            $.writeln(err.message + ", line: " + err.line);
        }
    };
    return myExcel;
}());
var myDialog = /** @class */ (function () {
    function myDialog(title) {
        this.obj = app.dialogs.add({ name: "".concat(title) });
        this.temp = this.obj.dialogColumns.add();
        this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
        this.obj.show();
        this.input = this.textObj.editContents;
    }
    return myDialog;
}());
var Input = /** @class */ (function () {
    function Input(myinput) {
        var input = myinput;
        input = input.replace(new RegExp(/^[\r\n]+/gm), "");
        var regex = new RegExp(/[\r\n]+/);
        var inputArr = input.split(regex); //入力を改行文字で分割
        this.inputDataArray = inputArr;
    }
    Input.prototype.trimkanji = function (str) {
        var mystr = str;
        var res = [];
        for (var num = 4; num > 0; num--) {
            var reg = new RegExp("[\u4E00-\u9FFF]{" + num + "}", "g");
            do {
                var strindex = mystr.search(reg);
                if (strindex == -1) {
                    break;
                }
                var pickupStr = mystr.slice(strindex, strindex + num);
                res.push(pickupStr);
                // $.writeln(pickupStr + " :target");
                mystr = mystr.replace(pickupStr, "");
            } while (mystr.search(reg) != -1);
        }
        return res;
    };
    Input.prototype.splitString = function (str, splitChar) {
        var res = str.split(splitChar);
        return res;
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
var Brakets = /** @class */ (function () {
    function Brakets() {
        this.input = "";
        this.replaced = "";
    }
    Brakets.prototype.getBracketsItem = function (string, braketType) {
        var reg = this.makeBraketReg(braketType);
        var match = string.match(reg);
        if (match == null) {
            return null;
        }
        var res = [];
        for (var i = 0; i < match.length; i++) {
            res.push(this.removeBrackets(match[i]));
        }
        return res;
    };
    Brakets.prototype.removeBrackets = function (string) {
        var reg = new RegExp(/[\[\]\《\》]/g);
        return string.replace(reg, "");
    };
    Brakets.prototype.removeBracketsAndItem = function (string, BraketsType) {
        var reg = this.makeBraketReg(BraketsType);
        return string.replace(reg, "");
    };
    Brakets.prototype.makeBraketReg = function (BraketsType) {
        switch (BraketsType) {
            case "round":
                return new RegExp(/\(.*?\)/g);
            case "kagi":
                return new RegExp(/\「.*?\」/g);
            case "dAngle":
                return new RegExp(/\《.*?\》/g);
            default:
                throw new Error("no Brakets Type");
        }
    };
    Brakets.prototype.getBracketsItemIndex = function (input) {
        var targetIndexArray = [];
        var start_index;
        var end_index;
        var reg1 = new RegExp(/[\(\[\《\<]/);
        var reg2 = new RegExp(/[\)\]\》\>]/);
        while (input.search(reg1) != -1) {
            start_index = input.search(reg1) + 1 - 1;
            end_index = input.search(reg2) - 1 - 1;
            input = input.replace(reg1, "");
            input = input.replace(reg2, "");
            targetIndexArray.push([start_index, end_index]);
        }
        return targetIndexArray;
    };
    return Brakets;
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
    var _textFrames = new textFrames(app.activeDocument.selection);
    var mystory = _textFrames.getStory();
    var dialog = new myDialog("エクセルの内容をコピーしてそのまま貼り付けてください");
    if (!(typeof dialog.input == "string")) {
        return;
    }
    var _a = inputTest(dialog.input), baseTexts = _a[0], positionIndex = _a[1], rubyIndex = _a[2], rubyPositionIndex = _a[3], InsertEnd = _a[4], youreiStyleIndex = _a[5];
    forloop(baseTexts.length, function (i) {
        var len = baseTexts[i].length; //文字数
        mystory.insertionPoints[-1].contents = baseTexts[i]; //textを挿入
        var applyParaStyle;
        if (youreiStyleIndex[i] == "1") {
            applyParaStyle = app.activeDocument.paragraphStyles.item("音訓用例");
        }
        else if (youreiStyleIndex[i] == "2") {
            applyParaStyle = app.activeDocument.paragraphStyles.item("音訓用例");
        }
        forloop(len, function (j) {
            var styledindex = len * -1;
            mystory.characters[styledindex].appliedParagraphStyle = applyParaStyle;
        });
        //太字スタイルの適用
        forloop(positionIndex[i].length, function (j) {
            var styledindex = len * -1 + positionIndex[i][j];
            mystory.characters[styledindex].appliedCharacterStyle = app.activeDocument.characterStyles.item("漢字表_用例太字");
        });
        //ルビを振る
        forloop(rubyPositionIndex[i].length, function (j) {
            var styledindex = len * -1 + rubyPositionIndex[i][j];
            mystory.characters[styledindex].rubyFlag = true;
            mystory.characters[styledindex].rubyString = rubyIndex[i][j];
        });
        switch (InsertEnd[i]) {
            case "break":
                mystory.insertionPoints[-1].contents = SpecialCharacters.FORCED_LINE_BREAK;
                break;
            case "space":
                mystory.insertionPoints[-1].contents = "　";
                break;
            case "special":
                mystory.insertionPoints[-1].contents = SpecialCharacters.FRAME_BREAK;
                break;
            default:
                throw new Error("insert end error");
                break;
        } //改行等挿入
        mystory.characters.lastItem().appliedCharacterStyle = app.activeDocument.characterStyles[0];
    });
    mystory.clearOverrides(); //Story上のオーバーライドを一括消去
    var allCharactor = mystory.characters;
    forloop(allCharactor.length, function (i) {
        var Char = allCharactor[i];
        if (Char.rubyType === RubyTypes.PER_CHARACTER_RUBY) {
            var rubyLen = Char.rubyString.length;
            switch (rubyLen) {
                case 3:
                    Char.rubyXScale = 66;
                    break;
                case 4:
                    Char.rubyXScale = 50;
                    break;
                default:
                    break;
            }
        }
    });
}
main();
function inputTest(input) {
    var _input = new Input(input);
    var _bracket = new Brakets();
    var baseTexts = []; //挿入される本文
    var positionIndex = []; //スタイルを変える位置
    var rubyIndex = []; //ルビ
    var rubyPositionIndex = []; //ルビの挿入位置
    var youreiInsertEnd = [];
    var youreiStyleIndex = [];
    forloop(_input.inputDataArray.length, function (i) {
        var item = _input.inputDataArray[i];
        var res = _input.splitString(item, "	");
        var countNumOfExe = 0;
        forloop(res.length, function (i) {
            //空要素を発見し次第処理を終了する。
            if (res[i] == "") {
                // $.writeln(i);
                return;
            }
            countNumOfExe++;
            //挿入される文についての処理
            if (i % 2 == 0) {
                var textRemovedBraket = _bracket.removeBrackets(res[i]);
                baseTexts.push(textRemovedBraket);
                var posStartAndEndArr = _bracket.getBracketsItemIndex(res[i]); //"あ(いうえ)お"のようなstringから、"い"と"え"のindexを抽出する
                var monorubyPosIndex = [];
                var monoPosIndex = [];
                // $.writeln(_bracket.getBracketsItemIndex(res[i]));
                for (var i_1 = posStartAndEndArr[0][0]; i_1 < posStartAndEndArr[0][1] + 1; i_1++) {
                    var reg = new RegExp(/[\u4E00-\u9FFF]/); //漢字の正規表現
                    if (reg.test(textRemovedBraket[i_1]))
                        monorubyPosIndex.push(i_1);
                    monoPosIndex.push(i_1);
                }
                if (posStartAndEndArr.length != 0)
                    rubyPositionIndex.push(monorubyPosIndex);
                if (monoPosIndex.length != 0)
                    positionIndex.push(monoPosIndex);
            }
            //ルビ文字配列についての処理
            if (i % 2 == 1) {
                // 文字"//"があれば"/"に変換する
                var reg = new RegExp(/\/\//);
                var remRoundText = _bracket.removeBracketsAndItem(res[i], "round");
                if (reg.test(remRoundText))
                    remRoundText = remRoundText.replace(reg, "/");
                rubyIndex.push(remRoundText.split("/"));
            }
        });
        var youLenCount = countNumOfExe / 2;
        switch (youLenCount) {
            case 1:
                youreiInsertEnd.push("special");
                youreiStyleIndex.push("1");
                break;
            case 2:
                youreiInsertEnd.push("break");
                youreiInsertEnd.push("special");
                youreiStyleIndex.push("2");
                youreiStyleIndex.push("2");
                break;
            case 3:
                youreiInsertEnd.push("break");
                youreiInsertEnd.push("space");
                youreiInsertEnd.push("special");
                youreiStyleIndex.push("2");
                youreiStyleIndex.push("2");
                youreiStyleIndex.push("2");
                break;
            case 4:
                youreiInsertEnd.push("space");
                youreiInsertEnd.push("break");
                youreiInsertEnd.push("space");
                youreiInsertEnd.push("special");
                youreiStyleIndex.push("2");
                youreiStyleIndex.push("2");
                youreiStyleIndex.push("2");
                youreiStyleIndex.push("2");
                break;
            default:
                throw new Error("yourei_sizi_switch_error");
                break;
        }
        // $.writeln(res.length);
    });
    return [baseTexts, positionIndex, rubyIndex, rubyPositionIndex, youreiInsertEnd, youreiStyleIndex];
}
