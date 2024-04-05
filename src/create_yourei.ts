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
  constructor(title: string) {
    this.obj = app.dialogs.add({ name: `${title}` });
    this.temp = this.obj.dialogColumns.add();
    this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
    this.obj.show();
  }
}

class Input {
  mySelection: any;
  constructor(selection: any) {
    this.mySelection = selection;
  }
  showObjType() {
    let selObj: any = this.mySelection;
    for (let i: number = 0; i < selObj.length; i++) {
      let dType: string = selObj[i].constructor.name;

      $.writeln(`${dType}`);
    }
  }
  showInputObjType(input: any) {
    let dType: string = input.constructor.name;

    $.writeln(`${dType}`);
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
function main() {
  const mydialog = new myDialog("poi");
  const input = mydialog.textObj.editContents;
  if (input == "" || input.length != 1) {
    return;
  }

  const active_folder_path: string = decodeURI(String(app.activeDocument.filePath)); ///ここをどうにかする。
  // const save_folder = Folder(active_folder_path).selectDlg("フォルダを選択してください。");

  const file = <File>File(active_folder_path).openDlg("ファイルを選択してください", "*.xlsx");
  if (!file) {
    return;
  }
  let insertText: string = "";
  let insertTar: RegExpMatchArray | null;
  let tarLength: number = 0;
  for (let i = 1; i < 5; i++) {
    let excel_instance = new myExcel(file.fsName, ";", String(i));
    let excel_data = excel_instance.GetDataFromExcelPC();
    excel_data.shift();
    if (excel_data[0] == undefined) {
      return;
    }
    let col: any = excel_data;
    let yourei_txt: string = "";
    for (let j = 1; j < col.length; j++) {
      if (input == col[j][1]) {
        let replaced_text = col[j][2].replace(new RegExp(/×〔.*〕/), "");
        yourei_txt = replaced_text;
        break;
      }
    }
    if (yourei_txt != "") {
      let regKagi = new RegExp(/\「.*?\」/g);
      let regKou = new RegExp(/\〔.*?\〕/g);
      if (regKagi.test(yourei_txt)) {
        insertTar = yourei_txt.match(regKagi);
      } else if (regKou.test(yourei_txt)) {
        insertTar = yourei_txt.match(regKou);
      } else {
        throw new Error("置き換えが見つからないよ");
        insertTar = null;
      }
      let replaceYourei = yourei_txt;
      if (insertTar != null) {
        tarLength = insertTar.length;
        for (let i = 0; i < insertTar.length; i++) {
          replaceYourei = replaceYourei.replace(insertTar[i], "＊");
        }
      }

      insertText = replaceYourei;
      $.writeln(insertText);
      $.writeln(insertTar);
      break;
    }
  }
  hoge(insertText, tarLength);
}

function hoge(text: string, tarlen: number) {
  let insert = text;
  const selectObj = <Group[]>app.activeDocument.selection;
  const selectitem: any[] = selectObj[0].allPageItems;
  let selName;

  let rectangle: Rectangle;
  let textFrame: TextFrame;
  for (let i = 0; i < selectitem.length; i++) {
    const e = selectitem[i];

    if (e.constructor.name == "TextFrame") {
      //初期値の取得
      textFrame = <TextFrame>e;
      rectangle = <Rectangle>textFrame.parentStory.pageItems[0].getElements()[0];
      let rectArray: any[] = [];
      for (let i = 0; i < tarlen; i++) {
        let res = rectangle.duplicate([0, 0], [0, 0]);
        rectArray.push(res);
      }
      rectangle.remove();
      //値の入力

      insert = insert.replace(new RegExp(/\＊/g), "「＊」");
      let indexes: number[] = getAllIndexes(insert, "＊");
      insert = insert.replace(new RegExp(/\＊/g), "");
      textFrame.contents = insert;
      for (let j = 0; j < indexes.length; j++) {
        let myPictureAnchor: any = textFrame.insertionPoints[indexes[j]]; //挿入ポイント指定（検索文字の一個前）

        rectArray[j].anchoredObjectSettings.insertAnchoredObject(myPictureAnchor, AnchorPosition.ANCHORED);
        rectArray[j].clearObjectStyleOverrides();
      }
    }
  }
  function getAllIndexes(string: string, val: string) {
    let indexes = [],
      i;
    for (i = 0; i < string.length; i++) {
      if (string.charAt(i) === val) indexes.push(i);
    }
    return indexes;
  }
  function anchoredIn(story: any): any {
    let ancObj: any;
    ancObj = story.add();
    ancObj.visibleBounds = ["0 mm", "0 mm", "4mm", "4 mm"];
    //ancObj.rotationAngle = 90;
    // ancObj.place(Item);
    ancObj.appliedObjectStyle = app.activeDocument.objectStyles.item("インライン基本");
    return ancObj;
  }
}
main();
