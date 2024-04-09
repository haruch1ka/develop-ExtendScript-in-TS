
class myExcel {
  excelFilePath: string;
  splitChar: string;
  sheetNumber: string;
  constructor(excelFilePath: any, splitChar: string, sheetNumber: string) {
    this.excelFilePath = excelFilePath;
    this.splitChar = splitChar;
    this.sheetNumber = sheetNumber;
  }
  GetDataFromExcelPC() {
    try {
      if (typeof this.splitChar === "undefined") this.splitChar = ";";
      if (typeof this.sheetNumber === "undefined") this.sheetNumber = "1";
      let appVersionNum = Number(String(app.version).split(".")[0]),
        data: any = [];

      let vbs = "Public s, excelFilePath\r";
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
      } else {
        // CS3 and below
        app.doScript(vbs, ScriptLanguage.VISUAL_BASIC);
      }

      let str = app.scriptArgs.getValue("excel_data");
      app.scriptArgs.clear();

      let tempArrLine,
        line,
        match,
        name,
        tempArrData = str.split("\r");

      for (let i = 0; i < tempArrData.length; i++) {
        line = tempArrData[i];
        if (line == "") continue;

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
    } catch (err: any) {
      $.writeln(err.message + ", line: " + err.line);
    }
  }
}
class myDialog {
  obj: any;
  temp: any;
  textObj: any;
  input: any;
  constructor(title: string) {
    this.obj = app.dialogs.add({ name: `${title}` });
    this.temp = this.obj.dialogColumns.add();
    this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
    this.obj.show();
    this.input = this.textObj.editContents;
  }
}
class Input {
  inputDataArray: string[];
  constructor(myinput: string) {
    let input = myinput;
    input = input.replace(new RegExp(/^[\r\n]+/gm), "");
    const regex = new RegExp(/[\r\n]+/);
    let inputArr: string[] = input.split(regex); //入力を改行文字で分割
    this.inputDataArray = inputArr;
  }
  trimkanji(str: string): string[] {
    let mystr = str;
    const res: string[] = [];

    for (let num = 4; num > 0; num--) {
      const reg = new RegExp("[\u4E00-\u9FFF]{" + num + "}", "g");
      do {
        const strindex = mystr.search(reg);
        if (strindex == -1) {
          break;
        }
        let pickupStr = mystr.slice(strindex, strindex + num);
        res.push(pickupStr);
        // $.writeln(pickupStr + " :target");
        mystr = mystr.replace(pickupStr, "");
      } while (mystr.search(reg) != -1);
    }
    return res;
  }
}
class textFrames {
  textFrames: TextFrames;
  contentsLength: number;
  constructor(TextFrames: TextFrames) {
    this.textFrames = TextFrames;
    this.contentsLength = this.textFrames.length;
  }
  getStory(): Story {
    let story: Story;
    story = this.textFrames[0].parentStory;

    return story;
  }
}
class Selection {
  obj: object[];
  type: string = "";
  is_selected: boolean = false;
  is_one: boolean = false;
  constructor() {
    this.obj = <object[]>app.activeDocument.selection;
    this.isSelected();
    if (this.is_selected) {
      this.gettype();
    }
  }
  gettype() {
    this.type = this.obj[0].constructor.name;
  }
  isSelected() {
    if (this.obj.length !== 0) {
      this.is_selected = true;
      this.is_one = this.isOne();
    } else {
      this.is_selected = false;
    }
  }
  isOne() {
    return this.obj.length === 1;
  }
}
function main() {
  const s = new Selection();
  $.writeln(s.is_selected);
  if (!s.is_selected) {
    alert("選択してください");
    return;
  }
  if (!s.is_one) {
    alert("1つ選択してください");
    return;
  }
  s.gettype();
  if (s.type !== "TextFrame") {
    alert("テキストフレームを選択してください");
    return;
  } else {
    $.writeln(s.type);
  }

  const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
  const mystory: Story = _textFrames.getStory();
  $.writeln(mystory.characters[0].rubyString);
  $.writeln(mystory.characters[1].rubyString);
  $.writeln(mystory.characters[11].rubyString);
}

// main();

function inputTest() {
  let dialog = new myDialog("test");
  let input = new Input(dialog.input);
  $.writeln(input.inputDataArray);
}
inputTest();
