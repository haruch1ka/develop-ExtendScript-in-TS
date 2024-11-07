//概要
//ストーリー上のルビの比率を変更するスクリプト
//うまく動作しないときには　"UTF-8 with BOM" で保存されているか確認すること
//
import polyfill from "./polyfill/polyfill";
import { myDialog, myDialogInputTxt } from "./dialog/dialog";
import { slashReadingEntity } from "./slashReadingEntity";
// import { slashReadingStructure } from "./slashReadingStructure";
import { formatText } from "./Props/TextFrameWrapper";

polyfill();

type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}

class Input {
	inputDataArray: any[];
	constructor(myinput: string, splitRegex: RegExp = new RegExp(/[\r\n]+/)) {
		let input = myinput;
		const regex = splitRegex;

		let inputArr: string[] = input.split(regex); //入力を改行文字で分割
		for (let i = 0; i < inputArr.length; i++) {
			//行頭の空白を削除
			inputArr[i] = inputArr[i].replace(/^\s+/, "");
		}
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
		$.writeln(s.type);
	}

	//入力データの処理
	let dialog = new myDialog("貼られたスラッシュ訳を流し込む");
	const dataArranging = (input: string) => {
		const _input = new Input(input);
		//先頭の数字を削除
		_input.trimDataArray();
		return _input.getDataArray();
	};

	//データの中身を"　　"で分割
	const inputArray: any[] = dataArranging(dialog.input1);
	const splitedArray: any[] = [];

	forloop(inputArray.length, (i) => {
		const line = inputArray[i];
		const regex = new RegExp("　　");
		const splitedLine = new Input(line, regex).getDataArray() as string[];
		splitedArray[i] = splitedLine;
		$.writeln("splited " + splitedLine);
	});

	const _slashReadingEntity = new slashReadingEntity();
	////////////////////テキストフレームにテキストを流し込む//////////////////////////////

	//頭数字のテキストフレームにテキストを流し込む
	forloop(_slashReadingEntity.myNumberTextFrames.length, (i) => {
		_slashReadingEntity.myNumberTextFrames[i].contents = (i + 1).toString();
	});
	//翻訳文をテキストフレームに流し込む
	let counter = 0;
	forloop(splitedArray.length, (i) => {
		forloop(splitedArray[i].length, (j) => {
			_slashReadingEntity.myTranslateTextFrames[counter].contents = splitedArray[i][j];
			counter++;
		});
	});
}

main();
