"use strict";
//概要
//ストーリー上のルビの比率を変更するスクリプト
//うまく動作しないときには　"UTF-8 with BOM" で保存されているか確認すること
//

//forloop関数
type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
//ダイアログクラス
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
//ラジオボタンのダイアログクラス
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
//ダイアログクラス
class myDialog {
	obj: any;
	temp: any;
	input1: any;
	input2: any;
	input3: any;
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		let _input1 = new myDialogInputTxt(this.temp, "ruby3文字 :", "66");
		let _input2 = new myDialogInputTxt(this.temp, "ruby4文字 :", "50");
		let _input3 = new myDialogInputRadio(this.temp, "文字組み方向 :");
		this.obj.show();
		_input1.getInput();
		_input2.getInput();
		_input3.getInput();

		this.input1 = _input1.input;
		this.input2 = _input2.input;
		this.input3 = _input3.input;
	}
}
// インプットの処理クラス
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

	const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
	const mystory: Story = _textFrames.getStory();
	const allCharactor = mystory.characters;

	let dialog = new myDialog("ストーリー内のルビ比率を変換します。");
	$.writeln(dialog.input1);
	$.writeln(dialog.input2);
	$.writeln(dialog.input3);

	forloop(allCharactor.length, (i) => {
		let Char = allCharactor[i];
		//ルビタイプが文字単位の場合
		if (Char.rubyType === RubyTypes.PER_CHARACTER_RUBY) {
			let rubyLen = Char.rubyString.length;
			if (!(rubyLen >= 3)) return true;
			let splitChar = null;

			//全角スペース又は半角スペースがある場合分割
			if (Char.rubyString.search(new RegExp("　")) >= 0) {
				splitChar = Char.rubyString.split("　");
			} else if (Char.rubyString.search(new RegExp(" ")) >= 0) {
				splitChar = Char.rubyString.split(" ");
			} else {
				return true;
			}
			if (splitChar == null) {
				throw new Error("splitChar が null です。");
			} else {
				$.writeln("splitChar is  = " + splitChar);
			}

			//ルビ文字を代入する
			for (let j = 0; j < splitChar.length; j++) {
				$.writeln("i + j " + (i + j) + " : " + splitChar[j]);
				allCharactor[i + j].rubyString = splitChar[j];
				//ルビフラグを立てる
				allCharactor[i + j].rubyFlag = true;
			}
		}
	});
	forloop(allCharactor.length, (i) => {
		let Char = allCharactor[i];
		//ルビタイプが文字単位の場合
		if (Char.rubyType === RubyTypes.PER_CHARACTER_RUBY) {
			let rubyLen = Char.rubyString.length;
			switch (rubyLen) {
				case 3:
					//ダイアログで入力された3文字のときの値を代入
					if (dialog.input3 == 0) Char.rubyXScale = Number(dialog.input1);
					if (dialog.input3 == 1) Char.rubyYScale = Number(dialog.input1);
					break;
				//ダイアログで入力された4文字のときの値を代入
				case 4:
					if (dialog.input3 == 0) Char.rubyXScale = Number(dialog.input2);
					if (dialog.input3 == 1) Char.rubyYScale = Number(dialog.input2);
					break;
				default:
					break;
			}
		}
	});
	// mystory.clearOverrides(OverrideType.PARAGRAPH_ONLY); //Story上のオーバーライドを一括消去
}
main();
