/// <reference types="types-for-adobe/InDesign/2021" />

class myDialog {
  obj: any;
  temp: any;
  textObj: any;
  inputArray: Array<string> = [];
  constructor(title: string) {
    //defaultContent : string,width :number,height :number
    this.obj = app.dialogs.add({ name: `${title}` });
    this.temp = this.obj.dialogColumns.add();
    this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
    this.obj.show();
  }
  arrangeInput() {
    let input = this.textObj.editContents;
    input = input.replace(new RegExp(/^[\r\n]+/gm), "");
    const regex = new RegExp(/[\r\n]+/);
    let inputArr: string[] = input.split(regex); //入力を改行文字で分割
    this.inputArray = inputArr;
  }
}
class Infomation {
  mySelection: any;
  constructor(selection: any) {
    this.mySelection = selection;
  }
  showObjType() {
    let selObj: any = app.activeDocument.selection;
    for (let i: number = 0; i < selObj.length; i++) {
      let dType: string = selObj[i].constructor.name;

      $.writeln(`${dType}`);
    }
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
    if (this.contentsLength == 1) {
      // $.writeln("length = 1");
      story = this.textFrames[0].parentStory;
    } else if (this.contentsLength > 1) {
      alert("テキストフレームは1つ選択してください");
      throw new Error("textframe is not 1");
    } else {
      alert("テキストフレームを選択エラー");
      throw new Error("textframe error");
    }
    // $.writeln("get " + story);
    return story;
  }
}

function input(): myDialog {
  let res: string;
  const mydialog = new myDialog("コピーした値を入力してください");
  mydialog.arrangeInput();
  return mydialog;
}

function main() {
  let selection: any = app.activeDocument.selection;
  let selectionLen: number = selection.length;
  //選択されていないときにはプログラムを終了する。
  if (!(selection.length > 0)) {
    alert("テキストボックスを選択してください！");
    return;
  }

  const dialog = input();
  const selTextFrames = <TextFrames>app.activeDocument.selection;
  const textframes = new textFrames(selTextFrames);
  const mystory = <Story>textframes.getStory();
  let contents = [];
  $.writeln(mystory.pageItems.length + " mystory page item");
  $.writeln(dialog.inputArray.length + " dialog input item");

  if (mystory.pageItems.length != dialog.inputArray.length) {
    alert("入力文字列数とアンカーボックスの数が違います");
    return;
  }
  for (let i: number = 0; i < mystory.pageItems.length; i++) {
    let anchor_textFrame = <TextFrame>mystory.pageItems[i].getElements()[0];
    // $.writeln(anchor_textFrame.contents);
    contents.push(anchor_textFrame);
  }

  for (let k: number = 0; k < contents.length; k++) {
    contents[k].contents = dialog.inputArray[k];
    // $.writeln("hogehoge");
  }
}
main();
