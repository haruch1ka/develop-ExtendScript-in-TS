//変数デフォルトパーセントを設定
const defaultPercent = 40;
const percentList = ["40%", "50%", "60%"];
//↑ここをいじると、ダイアログの初期値を変えられます。

const object_names: { [key: string]: string } = {
	Character: "一文字",
	TextStyleRange: "テキストのスタイルが連続している部分",
	Word: "単語",
	Line: "一行",
	Paragraph: "段落",
	Text: "選択したテキスト",
	TextColumn: "段組み１段分",
	TextFrame: "テキストフレーム",
	InsertionPoint: "挿入点",
};
function is_input_name_processing_target(object_name: string): boolean {
	switch (object_name) {
		case "Character": //一文字
		case "TextStyleRange": //テキストのスタイルが連続している部分
		case "Word": //単語
		case "Line": //一行分のテキスト
		case "Paragraph": // 段落
		//カーソルをクリックすると選択が　word → line → paragraph と切り替わる
		case "Text": //特定のテキスト
		case "TextColumn": //段組み１段分
		case "TextFrame": //テキストフレーム
			return true;
			break;
		case "InsertionPoint": //挿入点
		default:
			return false;
			break;
	}
}
type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
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
		return (this.type = this.obj[0].constructor.name);
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
class myPercentInput {
	row: any;
	PercentObj: any;
	input: any;
	constructor(targetObj: any, inputTitle: string, editValue: number) {
		const list: string[] = percentList;

		this.row = targetObj.dialogRows.add();
		let inputDiscription = this.row.dialogColumns.add();
		inputDiscription.staticTexts.add({ staticLabel: `${inputTitle}` });

		this.PercentObj = this.row.percentComboboxes.add({ editValue: editValue, minWidth: 80, stringList: list });
	}
	getInput() {
		return (this.input = this.PercentObj.editValue);
	}
}
class myDialog {
	obj: any;
	temp: any;
	input0: any;
	is_cancel: boolean = false;
	constructor(title: string, message: string[]) {
		try {
			this.obj = app.dialogs.add({ name: `${title}` });
			this.temp = this.obj.dialogColumns.add();
			this.temp = this.temp.borderPanels.add();
			this.temp = this.temp.dialogColumns.add();
			let _input0 = new myPercentInput(this.temp, "縮小率 :", defaultPercent);
			new myDialogText(this.temp, message);
			this.is_cancel = !this.obj.show();
			_input0.getInput();
			this.input0 = _input0.input;
		} catch (error: any) {
			alert(error);
		}
	}
}
class myDialogText {
	constructor(targetObj: any, inputTitle: string[]) {
		let row = targetObj.dialogRows.add();

		let inputDiscription = row.dialogColumns.add();
		inputDiscription.staticTexts.add({ staticLabel: `${inputTitle[0]}` });
	}
}

function divide_ruby(allCharactor: Characters, RubyIndexArray: number[][]) {
	$.writeln(RubyIndexArray);
	for (let i = 0; i < RubyIndexArray.length; i++) {
		let [index, count] = RubyIndexArray[i];
		if (count == 1) continue;
		let Ruby = allCharactor[index].rubyString;
		let splitChar;
		if (Ruby.search(new RegExp("　")) >= 0) {
			splitChar = Ruby.split("　");
		} else if (Ruby.search(new RegExp(" ")) >= 0) {
			splitChar = Ruby.split(" ");
		} else {
			continue;
		}
		for (let j = 0; j < count; j++) {
			$.writeln(allCharactor[index + j].contents + " : " + splitChar[j]);
			allCharactor[index + j].rubyFlag = true;
			allCharactor[index + j].rubyString = splitChar[j];
		}
	}
}
function search_ruby(allCharactor: Characters, rubyType: RubyTypes): number[][] {
	let counter = 1;
	const RubyIndexArray: number[][] = [];

	for (let i = 0; i < allCharactor.length; i += counter) {
		let Char = allCharactor[i];
		let doFlag = false;
		counter = 1;

		if (Char.rubyType != rubyType || !(Char.rubyString.length > 0)) {
			continue;
		}

		while (i + counter != allCharactor.length && allCharactor[i + counter].rubyFlag) {
			if (Char.rubyString === allCharactor[i + counter].rubyString) {
				counter++;
			} else {
				break;
			}
		}
		RubyIndexArray.push([i, counter]);
	}
	return RubyIndexArray;
}
function change_ruby_size(allCharactor: Characters, RubyIndexArray: number[][], rate: number) {
	for (let i = 0; i < RubyIndexArray.length; i++) {
		let [index, count] = RubyIndexArray[i];
		let tarChar = allCharactor[index];
		$.writeln(
			"文字 : " +
				tarChar.contents +
				"\nポイントサイズ : " +
				tarChar.pointSize +
				"\n水平比率 : " +
				tarChar.horizontalScale +
				"\nルビフォントサイズ : " +
				tarChar.rubyFontSize
		);
		let compute_ruby_rate = (tarChar.pointSize as number) * tarChar.horizontalScale * 0.01 * rate * 0.01;
		compute_ruby_rate = compute_ruby_rate * ((1 * 0.25) / 25.4) * 72;
		tarChar.rubyFontSize = compute_ruby_rate;
		//結果を小数点第一位まで表示
	}
}
function main(): void {
	const s = new Selection();
	// $.writeln(s.is_selected); //選択されているか？
	if (!s.is_selected) {
		alert("何も選択されていません");
		return;
	}
	s.gettype();
	if (!is_input_name_processing_target(s.type)) {
		alert("適切なオブジェクトを選択してください\n 選択中 → " + object_names[s.type]);
		return;
	}
	let message = ["選択範囲 → " + object_names[s.type]];
	const dialog = new myDialog("ルビサイズ縮小", message);
	$.writeln(dialog.input0);

	if (dialog.is_cancel) return;

	const myText = s.obj[0] as Text;
	const allCharactor = myText.characters as Characters;

	const RubyIndexArray = search_ruby(allCharactor, RubyTypes.PER_CHARACTER_RUBY);
	divide_ruby(allCharactor, RubyIndexArray);
	change_ruby_size(allCharactor, RubyIndexArray, dialog.input0);
}

main();
