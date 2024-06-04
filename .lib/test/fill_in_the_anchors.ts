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
相手を見る。
新しい洋服。
早朝におきる。
野球をする。
日光が当たる。
農家のしごと。
有名な絵。
話の全体。
世界の国。
安心する
バスの定員。
図書館
出来事
`;
let fuga = `詩
葉
旅
酒
次
局
県
氷
秒
昔
横
指
鉄
習
着
登
様
面
号
漢
味
章
題
発
平
由
相
洋
早
球
光
農
有
全
世
安
定
館
事
`;
class myDialog {
	obj: any;
	temp: any;
	temp2: any;

	textObj: any;
	textObj2: any;

	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		this.temp2 = this.obj.dialogColumns.add();

		this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
		this.textObj2 = this.temp2.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });

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
	processedArray: string[];
	input_one: string[][];
	input_two: string[];

	constructor(midashi: Input, mondai: Input) {
		this.input_one = midashi.trimforeach();
		this.input_two = mondai.trimforeach();
		const resArr: string[] = [];

		for (let i = 0; i < this.input_two.length; i++) {
			let res = this.filter(this.input_one[i], this.input_two[i]);
			// $.writeln(res);
			resArr.push(res);
		}
		this.processedArray = resArr;
	}
	filter(array: string[], element: string) {
		let res = "";
		for (let i: number = 0; i < array.length; i++) {
			if (array[i].indexOf(element) !== -1) {
				return array[i];
			}
		}
		return res;
	}
}

function main() {
	let mydia = new myDialog("左側に見出し語を右側に問題を入れてください。");
	$.writeln(mydia.textObj.editContents);
	$.writeln(mydia.textObj2.editContents);
	//何も入れずキャンセルを弾く
	if (mydia.textObj.editContents == "" || mydia.textObj2.editContents == "") {
		return;
	}
	const processedData = new process(new Input(mydia.textObj2.editContents), new Input(mydia.textObj.editContents));

	$.writeln(processedData.processedArray);
	$.writeln(processedData.input_one);
	$.writeln(processedData.input_two);
	let inputOnelen = processedData.input_one.length;
	let inputTwolen = processedData.input_two.length;

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
	if (pageItemsLen < 50) {
		for (let i = 0; i < pageItemsLen; i++) {
			if (i < pageItemsLen / 2) {
				pointAnchors.push(mystory.pageItems[i]);
			} else {
				myAnchorItems.push(mystory.pageItems[i]);
			}
		}
	}

	//入力に間違いが無いか(チェック甘め)
	$.writeln("inputOnelen " + inputOnelen);
	$.writeln("myAnchorItems.length " + myAnchorItems.length);
	$.writeln("inputTwolen " + inputTwolen);
	//入力に間違いが無いか(チェック甘め)
	if (inputOnelen < 10) {
		alert("入力漢字数が少なすぎます。");
		return;
	}
	if ((inputOnelen = myAnchorItems.length)) {
		alert(
			"入力しようとしている漢字をすべて単漢字として入力しようとしています。" +
				"アンカー数 " +
				myAnchorItems.length +
				"単漢字数 " +
				inputOnelen
		);
		return;
	}
	if (inputOnelen == inputTwolen) {
		alert("入力する単漢字と二文字漢字の数が同じです。");
		return;
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
			case 3: {
				let item = <TextFrame>anchor.pageItems[0].getElements()[0];
				let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];
				let item3 = <TextFrame>anchor.pageItems[2].pageItems[1].getElements()[0];
				// $.writeln(item.contents); //読み1 ex.(しょく)
				// $.writeln(item2.contents); //読み0 ex.(てい)
				// $.writeln(item3.contents); //漢字二文字　ex.(定食)

				item3.contents = processedData.processedArray[i];
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

				item6.contents = processedData.processedArray[i];
				break;
			}

			default:
				break;
		}
	}
}

main();
