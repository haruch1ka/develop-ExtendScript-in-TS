type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
  for (let i = 0; i < times; i++) {
    func(i);
  }
}
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
  splitString(str: string, splitChar: string): string[] {
    let res = str.split(splitChar);
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
class Brakets {
  input: string = "";
  replaced: string = "";
  getBracketsItem(string: string, braketType: string): string[] | null {
    const reg = this.makeBraketReg(braketType);
    const match = string.match(reg);
    if (match == null) {
      return null;
    }
    let res: string[] = [];
    for (let i = 0; i < match.length; i++) {
      res.push(this.removeBrackets(match[i]));
    }
    return res;
  }
  removeBrackets(string: string): string {
    let reg = new RegExp(/[\(\)\[\]\《\》]/g);
    return string.replace(reg, "");
  }
  removeBracketsAndItem(string: string, BraketsType: string): string {
    let reg = this.makeBraketReg(BraketsType);
    return string.replace(reg, "");
  }
  makeBraketReg(BraketsType: string): RegExp {
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
  }
  getBracketsItemIndex(input: string): number[][] {
    let targetIndexArray = [];
    let start_index: number;
    let end_index: number;
    let reg1 = new RegExp(/[\(\[\《\<]/);
    let reg2 = new RegExp(/[\)\]\》\>]/);
    while (input.search(reg1) != -1) {
      start_index = input.search(reg1) + 1 - 1;
      end_index = input.search(reg2) - 1 - 1;
      input = input.replace(reg1, "");
      input = input.replace(reg2, "");
      targetIndexArray.push([start_index, end_index]);
    }
    return targetIndexArray;
  }
}
function main() {
  const s = new Selection();
  // $.writeln(s.is_selected); //選択されているか？
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
    // $.writeln(s.type);
  }

  const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
  const mystory: Story = _textFrames.getStory();

  let testinput: string = `協力を《要請》する。	よう/せい	《安請け合い》する。	やす/う(け)/あ		
何の《変哲》もない。	へん/てつ				
市場を《独占》する。	どく/せん	《占める》。	し	《占う》。	うらな
《屈辱》を味わう。	くつ/じょく				
《選抜》チーム。	せん/ばつ	相手を追い《抜く》。	ぬ		
《彫刻刀》でけずる。	ちょう/こく/とう	版画を《彫る》。	ほ		
`;
  const [baseTexts, positionIndex, rubyIndex, rubyPositionIndex, InsertEnd] = inputTest(testinput);

  forloop(baseTexts.length, (i) => {
    const len = baseTexts[i].length;
    $.writeln(len);
    mystory.insertionPoints[-1].contents = baseTexts[i]; //textを挿入
    switch (InsertEnd[i]) {
      case "break":
        if (len < 8) mystory.insertionPoints[-1].contents = "\r";
        break;
      case "space":
        mystory.insertionPoints[-1].contents = " ";
        break;
      case "special":
        if (len < 8) mystory.insertionPoints[-1].contents = SpecialCharacters.FRAME_BREAK;
        break;
      default:
        throw new Error("insert end error");
        break;
    }

    $.writeln(InsertEnd[i]);

    // let styledindex = len * -1 + positionIndex[i][0];
    // $.writeln(mystory.characters[styledindex].contents);
    // styledindex = len * -1 + positionIndex[i][1];
    // $.writeln(mystory.characters[styledindex].contents);

    // forloop(positionIndex[i].length, (j) => {

    // });
    // $.writeln(positionIndex[i]);
    // $.writeln(rubyPositionIndex[i]);
  });
  // $.writeln(mystory.characters[0].rubyString);
  // $.writeln(mystory.characters[1].rubyString);
  // $.writeln(mystory.characters[11].rubyString);
}

main();

function inputTest(input: string): [string[], number[][], string[][], number[][], string[]] {
  // let dialog = new myDialog("test");
  let mytest = input;
  let _input = new Input(input);
  // let _input = new Input(dialog.input);
  let _bracket = new Brakets();

  let baseTexts: string[] = []; //挿入される本文
  let positionIndex: number[][] = []; //スタイルを変える位置
  let rubyIndex: string[][] = []; //ルビ
  let rubyPositionIndex: number[][] = []; //ルビの挿入位置
  let youreiInsertEnd: string[] = [];

  forloop(_input.inputDataArray.length, (i) => {
    let item = _input.inputDataArray[i];
    let res = _input.splitString(item, "	");

    let countNumOfExe = 0;
    forloop(res.length, (i) => {
      //空要素を発見し次第処理を終了する。
      if (res[i] == "") {
        // $.writeln(i);
        return;
      }
      countNumOfExe++;
      //挿入される文についての処理
      if (i % 2 == 0) {
        let textRemovedBraket = _bracket.removeBrackets(res[i]);
        baseTexts.push(_bracket.removeBrackets(res[i]));
        let posStartAndEndArr = _bracket.getBracketsItemIndex(res[i]); //"あ(いうえ)お"のようなstringから、"い"と"え"のindexを抽出する
        let monorubyPosIndex: number[] = [];
        let monoPosIndex: number[] = [];
        // $.writeln(_bracket.getBracketsItemIndex(res[i]));
        for (let i = posStartAndEndArr[0][0]; i < posStartAndEndArr[0][1] + 1; i++) {
          let reg = new RegExp(/[\u4E00-\u9FFF]/); //漢字の正規表現
          if (reg.test(textRemovedBraket[i])) monorubyPosIndex.push(i);
          monoPosIndex.push(i);
        }
        if (posStartAndEndArr.length != 0) rubyPositionIndex.push(monorubyPosIndex);
        if (monoPosIndex.length != 0) positionIndex.push(monoPosIndex);
      }
      //ルビ文字配列についての処理
      if (i % 2 == 1) {
        // 文字"//"があれば"/"に変換する
        let reg = new RegExp(/\/\//);
        let remRoundText = _bracket.removeBracketsAndItem(res[i], "round");
        if (reg.test(remRoundText)) remRoundText = remRoundText.replace(reg, "/");
        rubyIndex.push(remRoundText.split("/"));
      }
    });

    let youLenCount = countNumOfExe / 2;
    switch (youLenCount) {
      case 1:
        youreiInsertEnd.push("special");
        break;
      case 2:
        youreiInsertEnd.push("break");
        youreiInsertEnd.push("special");
        break;
      case 3:
        youreiInsertEnd.push("space");
        youreiInsertEnd.push("break");
        youreiInsertEnd.push("special");
        break;
      case 4:
        youreiInsertEnd.push("space");
        youreiInsertEnd.push("break");
        youreiInsertEnd.push("space");
        youreiInsertEnd.push("special");
        break;
      default:
        throw new Error("yourei_sizi_switch_error");

        break;
    }
    // $.writeln(res.length);
  });
  return [baseTexts, positionIndex, rubyIndex, rubyPositionIndex, youreiInsertEnd];
}
