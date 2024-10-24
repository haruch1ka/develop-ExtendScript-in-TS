// let hoge = `詩を楽しむ。
// 葉っぱをひろう。
// 旅にでる。
// あま酒をのむ。
// 次のページ。
// ゆうびん局
// 県道をとおる。
// 氷でひやす。
// 六十秒
// 今と昔。
// 横になる。
// 指をまげる。
// 鉄ぼうであそぶ。
// 国語の学習。
// 着目する
// 登場人物
// 町の様子。
// すきな場面。
// 番号をつける。
// 漢字でかく。
// ことばの意味。
// 文章を読む。
// 算数の問題。
// 新発売の本。
// 平気な顔。
// 自由になる。
// 相手を見る。
// 新しい洋服。
// 早朝におきる。
// 野球をする。
// 日光が当たる。
// 農家のしごと。
// 有名な絵。
// 話の全体。
// 世界の国。
// 安心する
// バスの定員。
// 図書館
// 出来事
// `;
// let fuga = `詩
// 葉
// 旅
// 酒
// 次
// 局
// 県
// 氷
// 秒
// 昔
// 横
// 指
// 鉄
// 習
// 着
// 登
// 様
// 面
// 号
// 漢
// 味
// 章
// 題
// 発
// 平
// 由
// 相
// 洋
// 早
// 球
// 光
// 農
// 有
// 全
// 世
// 安
// 定
// 館
// 事
// `;
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

function main() {
	let mydia = new myDialog("左側に見出し語を右側に問題を入れてください。");
	$.writeln(mydia.textObj.editContents);
	//何も入れずキャンセルを弾く
	if (mydia.textObj.editContents == "") {
		return;
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

	$.writeln(myAnchorItems.length + " mystory page item");
	for (let i: number = 0; i < myAnchorItems.length; i++) {
		let anchor = myAnchorItems[i];
		switch (anchor.pageItems.length) {
			case 2: {
				let item = <TextFrame>anchor.pageItems[0].getElements()[0];
				let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];
				// $.writeln(item.contents); //読み ex.(し)
				// $.writeln(item2.contents); //漢字ー文字　ex.(詩)

				let insert: string = String(processedData.input_two[i]);
				item2.contents = insert;
				break;
			}

			default:
				break;
		}
	}
}

main();

let hogho = `かい
ぎゃく
そ
か
こう
し
ぼう
へ-る
き
あつ
きゅう
ぼう
き
はか
てき
こう
か-す
ねん
しゅう
じゅん
ひ
おう
そく
がく
とう
ゆ
ざい
かた
てい
しょう
じょ
さい
しょう
そん
ご
じゅつ
かい
こう
えい
せい
ささ-える
かぎ-る
まよ-う
やぶ-る
まず-しい
つく-る
せ-める
こ-える
やさ-しい
おさ-める
`;

let reg = new RegExp(/\-*+$/);
let yomi = new Input(hogho);
for (let i = 0; i < yomi.inputDataArray.length; i++) {
	$.writeln(yomi.inputDataArray[i]);
}
