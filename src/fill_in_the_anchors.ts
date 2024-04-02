class Input {
  inputDataArray: string[];
  constructor(myinput: string) {
    let input = myinput;
    input = input.replace(new RegExp(/^[\r\n]+/gm), "");
    const regex = new RegExp(/[\r\n]+/);
    let inputArr: string[] = input.split(regex); //入力を改行文字で分割
    this.inputDataArray = inputArr;
  }
  trimkanji(str: string) {
    const pattern = new RegExp(/[\u4E00-\u9FFF]{2}/g);
    const matches = str.match(pattern);
    $.writeln(matches);
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
    return story;
  }
}

function main() {
  const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
  const mystory = <Story>_textFrames.getStory();

  $.writeln(mystory.pageItems.length + " mystory page item");
  for (let i: number = 0; i < mystory.pageItems.length; i++) {
    let anchor = mystory.pageItems[i];

    switch (anchor.pageItems.length) {
      case 2: {
        let item = <TextFrame>anchor.pageItems[0].getElements()[0];
        let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];
        // $.writeln(item.contents);
        // $.writeln(item2.contents);
        break;
      }
      case 3: {
        let item = <TextFrame>anchor.pageItems[0].getElements()[0];
        let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];
        let item3 = <TextFrame>anchor.pageItems[2].pageItems[1].getElements()[0];
        // $.writeln(item.contents); //読み1 ex.(しょく)
        // $.writeln(item2.contents); //読み0 ex.(てい)
        // $.writeln(item3.contents); //漢字二文字　ex.(定食)
        break;
      }
      case 6: {
        // let item = <TextFrame>anchor.pageItems[0].getElements()[0];// これはobject GraphicLine
        // let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];// これはobject GraphicLine
        let item3 = <TextFrame>anchor.pageItems[2].getElements()[0];
        let item4 = <TextFrame>anchor.pageItems[3].getElements()[0];
        let item5 = <TextFrame>anchor.pageItems[4].getElements()[0];
        let item6 = <TextFrame>anchor.pageItems[5].getElements()[0];
        // $.writeln(item);
        // $.writeln(item2);
        // $.writeln(item3.contents); //読み2 ex.(かん)
        // $.writeln(item4.contents); //読み1 ex.(しょ)
        // $.writeln(item5.contents); //読み0 ex.(と)
        // $.writeln(item6.contents); //漢字三文字　ex.(図書館)
        break;
      }

      default:
        break;
    }
  }
}

let hoge = `詩を楽しむ。
葉っぱをひろう。
旅にでる。
あま酒をのむ。
次のページ。
ゆうびん局
県道をとおる。
氷でひやす。
六十秒
今と昔。
横になる。
指をまげる。
鉄ぼうであそぶ。
国語の学習。
着目する
登場人物
町の様子。
すきな場面。
番号をつける。
漢字でかく。
ことばの意味。
文章を読む。
算数の問題。
新発売の本。
平気な顔。
自由になる。

`;
let _input = new Input(hoge);
_input.show();
