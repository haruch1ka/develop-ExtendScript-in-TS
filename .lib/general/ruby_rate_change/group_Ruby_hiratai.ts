"use strict";
//グループルビに対して、ルビの比率を変更するスクリプト
// {(親文字数 * 2) / ルビ文字数 } * 100 = ルビ1文字の比率 (%)
//　を計算し、ルビの水平/垂直比率を変更する
type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
class myDialogText {
	constructor(targetObj: any, inputTitle: string) {
		let row = targetObj.dialogRows.add();
		let inputDiscription = row.dialogColumns.add();
		inputDiscription.staticTexts.add({ staticLabel: `${inputTitle}` });
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

	// input1: any;
	// input2: any;
	input0: any;
	is_cancel: boolean;
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		let _input0 = new myDialogInputRadio(this.temp, "文字組み方向 :");
		this.is_cancel = !this.obj.show();
		_input0.getInput();
		this.input0 = _input0.input;
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

//選択されたオブジェクトに関する情報を取得するクラス
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
	$.writeln(dialog.is_cancel);
	if (dialog.is_cancel) return;

	function changeRate(character: Character, counter: number) {
		let rubyLen = character.rubyString.length;
		if (rubyLen <= counter * 2) {
			$.writeln("      文字溢れなし");
			return;
		}
		let rate = (counter * 200) / rubyLen;
		rate = Math.floor(rate);
		if (rate < 50) rate = 50;
		$.writeln("      ルビ比率 " + rate);
		if (dialog.input0 == 0) character.rubyXScale = Number(rate);
		if (dialog.input0 == 1) character.rubyYScale = Number(rate);
	}

	let currentRubyChar;
	let counter = 1;
	forloop(allCharactor.length, (i) => {
		let Char = allCharactor[i];
		let nextChar = allCharactor[i + 1];
		//ルビタイプが文字単位の場合
		let doFlag = false;
		if (Char.rubyType === RubyTypes.GROUP_RUBY) {
			$.writeln("-------------------");
			if (i == allCharactor.length - 1) {
				doFlag = true;
			} else if (nextChar.rubyString !== Char.rubyString) {
				doFlag = true;
			}

			if (doFlag) {
				for (let j = counter; j > 0; j--) {
					let diff = 1 - j;
					$.writeln("グループルビ " + allCharactor[i + diff].contents);
					changeRate(allCharactor[i + diff], counter);
				}
				counter = 1;
			} else {
				counter++;
			}
			$.writeln("-------------------");
		} else if (Char.rubyType === RubyTypes.PER_CHARACTER_RUBY) {
			$.writeln("モノルビ	: " + Char.contents);
		}
	});
}

main();
