"use strict";
//概要
//ストーリー上のルビの比率を変更するスクリプト
//うまく動作しないときには　"UTF-8 with BOM" で保存されているか確認すること
//

type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
class myDialogInputTxt {
	row: any;
	inputObj: any;
	input: any;
	constructor(targetObj: any, inputTitle: string, editText: string) {
		this.row = targetObj.dialogRows.add();
		let inputDiscription = this.row.dialogColumns.add();
		inputDiscription.staticTexts.add({ staticLabel: `${inputTitle}` });
		this.inputObj = this.row.textEditboxes.add({ editContents: `${editText}`, minWidth: 80 });
	}
	getInput() {
		this.input = this.inputObj.editContents;
	}
}
class myDialogInputTxtLarge {
	row: any;
	inputObj: any;
	input: any;
	constructor(targetObj: any, inputTitle: string, editText: string) {
		this.row = targetObj.dialogRows.add();
		let inputDiscription = this.row.dialogColumns.add();
		inputDiscription.staticTexts.add({ staticLabel: `${inputTitle}` });
		this.inputObj = this.row.textEditboxes.add({ editContents: `${editText}`, minWidth: 80 });
	}
	getInput() {
		this.input = this.inputObj.editContents;
	}
}
class myDialogInputRadio {
	row: any;
	radioObj: any;
	input: any;
	constructor(targetObj: any, inputTitleArray: string) {
		this.row = targetObj.dialogRows.add();
		let inputDiscription = this.row.dialogColumns.add();
		inputDiscription.staticTexts.add({ staticLabel: `${inputTitleArray}` });
		this.radioObj = this.row.radiobuttonGroups.add();
		this.radioObj.radiobuttonControls.add({ staticLabel: "縦", checkedState: true });
		this.radioObj.radiobuttonControls.add({ staticLabel: "横" });
	}
	getInput() {
		this.input = this.radioObj.selectedButton;
	}
}

class myDialog {
	obj: any;
	temp: any;
	input1: any;
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		let _input1 = new myDialogInputTxt(this.temp, "スラッシュ訳 :", "");
		this.obj.show();
		_input1.getInput();

		this.input1 = _input1.input;
	}
}

class Input {
	inputDataArray: any[];
	constructor(myinput: string, splitRegex: RegExp = new RegExp(/[\r\n]+/)) {
		let input = myinput;
		// const regex = new RegExp(/[\r\n]+/);
		const regex = splitRegex;

		let inputArr: string[] = input.split(regex); //入力を改行文字で分割
		this.inputDataArray = inputArr;
	}
	public getDataArray() {
		return this.inputDataArray;
	}
	public trimDataArray() {
		forloop(this.inputDataArray.length, (i) => {
			let regex: RegExp = new RegExp(`^.{1}`);
			if (i + 1 >= 10) regex = new RegExp(`^.{2}`);
			const line = this.inputDataArray[i].replace(regex, "");
			this.inputDataArray[i] = line;
		});
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
	} else {
		// $.writeln(s.type);
	}
	//入力データの処理
	let dialog = new myDialog("貼られたスラッシュ訳を流し込む");
	const input = new Input(dialog.input1);
	//先頭の数字を削除
	input.trimDataArray();

	//データの中身を"　　"で分割
	const splitedArray: any[] = [];
	const inputArray: any[] = input.getDataArray();
	forloop(inputArray.length, (i) => {
		const line = inputArray[i];
		const regex = new RegExp("　　");
		const splitedLine = new Input(line, regex).getDataArray() as string[];
		splitedArray[i] = splitedLine;
		$.writeln("splited " + splitedLine);
	});

	//アンカーオブジェクトを取得
	const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
	const mystory: Story = _textFrames.getStory();
	const myAnchorItems: PageItem[] = [];
	for (let i = 0; i < mystory.pageItems.length; i++) {
		myAnchorItems.push(mystory.pageItems[i]);
	}

	//アンカーオブジェクトから□数字と
	//訳文のテキストフレームを抽出
	const myNumberTextFrames: TextFrame[] = [];
	const myTranslateTextFrames: TextFrame[] = [];

	for (let i = 0; i < mystory.pageItems.length; i++) {
		let anchorItem = myAnchorItems[i];
		switch (anchorItem.getElements()[0].constructor.name) {
			case "TextFrame":
				const textFrame: TextFrame = anchorItem.getElements()[0] as TextFrame;
				// $.writeln("contents  " + textFrame.contents);
				const bounds = textFrame.geometricBounds;
				const width = (bounds[3] as number) - (bounds[1] as number);

				if (width < 5) {
					myNumberTextFrames.push(textFrame);
				} else {
					myTranslateTextFrames.push(textFrame);
				}
				break;
			case "Rectangle":
				const rectangle: Rectangle = anchorItem.getElements()[0] as Rectangle;
				// rectangle.remove();
				// $.writeln("rectangle  " + rectangle);
				break;
			default:
				// $.writeln("default");
				break;
		}
	}
	$.writeln("--------------------");

	////////////////////テキストフレームにテキストを流し込む//////////////////////////////

	$.writeln("myNumberTextFrames " + myNumberTextFrames.length);
	//頭数字のテキストフレームにテキストを流し込む
	forloop(myNumberTextFrames.length, (i) => {
		myNumberTextFrames[i].contents = (i + 1).toString();
	});
	//翻訳文をテキストフレームに流し込む
	let counter = 0;
	forloop(splitedArray.length, (i) => {
		forloop(splitedArray[i].length, (j) => {
			myTranslateTextFrames[counter].contents = splitedArray[i][j];
			// myTranslateTextFrames[counter].contents = splitedArray[i][j];
			counter++;
		});
	});
}
function insertTranslation() {}

main();
