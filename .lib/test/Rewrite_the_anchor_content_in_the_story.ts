//まとめの単漢字をアンカーボックスの中に挿入するスクリプト
//挿入先が漢字ボックスと読みボックスの2つの場合動作する
//％が入っている場合は動作しない

/// <reference types="types-for-adobe/InDesign/2021" />
class Input {
	inputDataArray: string[];
	constructor(myinput: string) {
		let input = myinput;
		input = input.replace(new RegExp(/^[\r\n]+/gm), "");
		const regex = new RegExp(/[\r\n]+/);
		let inputArr: string[] = input.split(regex); //入力を改行文字で分割
		this.inputDataArray = inputArr;
	}
}
class myDialog {
	obj: any;
	temp: any;
	textObj: any;
	inputArray: Array<string> = [];
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
		this.obj.show();
		const input = new Input(this.textObj.editContents);
		this.inputArray = input.inputDataArray;
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
		return story;
	}
}

function inputing(): myDialog {
	let res: string;
	const mydialog = new myDialog("まとめ単漢字入力スクリプト40");
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

	const dialog = inputing();
	const selTextFrames = <TextFrames>app.activeDocument.selection;
	const textframes = new textFrames(selTextFrames);
	const mystory = <Story>textframes.getStory();

	$.writeln(mystory.pageItems.length + " mystory page item");
	$.writeln(dialog.inputArray.length + " dialog input item");

	if (mystory.pageItems.length != dialog.inputArray.length) {
		alert("入力文字列数とアンカーボックスの数が違います");
		return;
	}
	for (let i: number = 0; i < mystory.pageItems.length; i++) {
		let anchor_textFrame = <TextFrame>mystory.pageItems[i].getElements()[0];
		// $.writeln(anchor_textFrame.getElements()[0].contents);
		anchor_textFrame.pageItems[1].getElements()[0].contents = dialog.inputArray[i];
	}
}
main();
