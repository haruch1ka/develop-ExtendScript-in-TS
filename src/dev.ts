//アンカーボックス内に正答率を流し込むスクリプト
//入力欄に正答率をエクセルからコピペしてくる。
//入力欄の数のみをコピペすること
//オブジェクトスタイル名の"正答率"を判別基準にしているので、スタイル名を変更すると動きません。
//名前を変更した場合は、スクリプト内のスタイル名を変更してください。

type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
class myDialog {
	obj: any;
	temp: any;
	temp2: any;

	textObj: any;
	textObj2: any;

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
		input = input.replace(new RegExp(/[\x20\u3000]/gm), "");
		input = input.replace(" ", "");
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
	let mydia = new myDialog("エクセルから%の列をコピーアンドペーストして下さい。");
	//editContentsはダイアログで入力された文字列
	//何も入れずキャンセルを弾く
	if (mydia.textObj.editContents == "") {
		return;
	}
	//改行された文字列を配列に変換
	const input = new Input(mydia.textObj.editContents);
	const processedData = input.inputDataArray;
	$.writeln("-----------------");
	// %の配列
	$.writeln(processedData);
	$.writeln("-----------------");

	let inputOnelen = processedData.length;

	const selectObj = <object[]>app.activeDocument.selection;
	const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
	const mystory = <Story>_textFrames.getStory();

	const pageItemsLen = mystory.pageItems.length;
	// $.writeln("選択ストーリ内にあるアイテムの個数 " + pageItemsLen);
	const myAnchorItems: PageItem[] = [];
	const pointAnchors: PageItem[] = [];

	let isSeitouStyle = false;
	let isKaitouranStyle = false;
	for (let i = 0; i < pageItemsLen; i++) {
		let element = mystory.pageItems[i].getElements()[0];
		if (element.appliedObjectStyle.name == "正答率") {
			$.writeln(element.appliedObjectStyle.name);
			pointAnchors.push(element);
			isSeitouStyle = true;
		} else if (element.appliedObjectStyle.name == "□解答欄_アンカー") {
			$.writeln(element.appliedObjectStyle.name);
			myAnchorItems.push(element);
			isKaitouranStyle = true;
		} else {
			$.writeln(element.appliedObjectStyle.name + " プログラムが認識していないスタイル");
		}
	}

	//入力に間違いが無いか(チェック甘め)
	$.writeln("左側ダイアログに入力された%の個数 " + inputOnelen);
	$.writeln("ストーリ内にある解答欄の個数 " + myAnchorItems.length);
	$.writeln("ストーリ内にある正答率の個数 " + pointAnchors.length);
	if (inputOnelen < 10) {
		alert("入力漢字数が少なすぎます。");
		return;
	}

	for (let i: number = 0; i < pointAnchors.length; i++) {
		let anchor = pointAnchors[i];
		let myTextFrame = <TextFrame>pointAnchors[i].getElements()[0];
		removeOverset(myTextFrame);
		$.writeln(processedData[i] + "%");

		let insertText = processedData[i] + "％";
		myTextFrame.contents = insertText;
	}
}
main();

function removeOverset(textFrame: TextFrame) {
	if (textFrame.overflows) {
		let cb = textFrame.texts[0].insertionPoints.firstItem();
		let ce = textFrame.parentStory.texts[0].insertionPoints.lastItem();
		let item = textFrame.texts.itemByRange(cb, ce);
		if (item instanceof Text) {
			item.remove();
		} else {
			throw new Error("The returned item is not of type Text");
		}
	}
}
