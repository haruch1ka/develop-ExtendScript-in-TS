class myDialog {
  obj: any;
  temp3: any;
  textObj3: any;
  constructor(title: string) {
    this.obj = app.dialogs.add({ name: `${title}` });
    this.temp3 = this.obj.dialogColumns.add();
    this.textObj3 = this.temp3.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
    this.obj.show();
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
        // $.writeln(mystr + " :replaced");
      } while (mystr.search(reg) != -1);
    }
    return res;
  }

  trimforeach(): any {
    let res = [];
    for (let i = 0; i < this.inputDataArray.length; i++) {
      res.push(this.trimkanji(this.inputDataArray[i]));
    }
    return res;
  }
  show() {
    for (let i = 0; i < this.inputDataArray.length; i++) {
      this.trimkanji(this.inputDataArray[i]);
    }
  }
}
class Infomation {
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
class process {
  input_three: string[] = [];
}

function main() {
  let mydia = new myDialog("左側に見出し語を右側に問題を入れてください。");
  //何も入れずキャンセルを弾く
  if (mydia.textObj3.editContents == "") {
    return;
  }

  const processedData = new process();
  let threeInput = null;

  if (mydia.textObj3.editContents != "") {
    threeInput = new Input(mydia.textObj3.editContents);

    for (let i = 0; i < threeInput.inputDataArray.length; i++) {
      let element = threeInput.inputDataArray[i];
      element = element.replace(" ", "");
      let persent = element + "％";
      processedData.input_three.push(persent);
    }

    $.writeln(processedData.input_three);
  }

  const selectObj = <object[]>app.activeDocument.selection;
  let selName;
  //選択しているか？
  if (selectObj[0]) {
    selName = selectObj[0].constructor.name;
  }
  //テキストフレームを選択しているか？
  if (selName != "TextFrame") {
    alert("テキストフレームを選択してください。#error1");
    return;
  } else if (selectObj.length > 1) {
    alert("テキストフレームは一つ選択してください。#error1.5 ");
    return;
  }
  const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
  const mystory = <Story>_textFrames.getStory();

  const pageItemsLen = mystory.pageItems.length;
  $.writeln(pageItemsLen);
  const myAnchorItems: PageItem[] = [];
  const pointAnchors: PageItem[] = [];
  if (pageItemsLen > 50) {
    for (let i = 0; i < pageItemsLen; i++) {
      if (i < pageItemsLen / 2) {
        pointAnchors.push(mystory.pageItems[i]);
      } else {
        myAnchorItems.push(mystory.pageItems[i]);
      }
    }
  }

  //入力に間違いが無いか(チェック甘め)
  if (myAnchorItems.length != processedData.input_three.length) {
    $.writeln("myAnchorItems.length " + myAnchorItems.length);
    alert("選択した文字列の数が違います。");
    return;
  }

  $.writeln(myAnchorItems.length + " mystory page item");

  if (threeInput != null) {
    for (let i: number = 0; i < pointAnchors.length; i++) {
      let anchor = <TextFrame>pointAnchors[i].getElements()[0];
      anchor.contents = processedData.input_three[i];
    }
  }
}

main();

let teststerrr = `
  カイ
ギャク
ソ
カ
コウ
シ
ボウ
へ-る
キ
アツ
キュウ
ボウ
キ
はか
テキ
コウ
か-す
ネン
シュウ
ジュン
ヒ
オウ
ソク
ガク
トウ
ユ
ザイ
かた
テイ
ショウ
ジョ
サイ
ショウ
ソン
ゴ
ジュツ
カイ
コウ
エイ
セイ

`;
let testreg = new RegExp(/-*$/);
