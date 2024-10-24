"use strict";
//
//エンジニアの方へ... このスクリプトは、.tsで書かれたものを.jsへコンパイルして製作されています。
//

type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}

class myDialog {
	obj: any;
	temp: any;
	textObj: any;
	input: any;
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
		this.obj.show();
		this.input = this.textObj.editContents;
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
			} while (mystr.search(reg) != -1);
		}
		return res;
	}
	splitString(str: string, splitChar: string): string[] {
		let res = str.split(splitChar);
		return res;
	}
}
class textFrame {
	textFrame: TextFrame;
	constructor(TextFrame: TextFrame) {
		this.textFrame = TextFrame;
	}
	getStory(): Story {
		let story: Story;
		story = this.textFrame.parentStory;

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
	s.gettype();
	if (s.type !== "TextFrame") {
		alert("テキストフレームを選択してください");
		return;
	} else {
		// $.writeln(s.type);
	}

	/* @ts-ignore */
	const selections: TextFrame[] = <TextFrames>app.activeDocument.selection;
	const _textFrame = new textFrame(selections[1]);
	const mystory: Story = _textFrame.getStory();
	const mystoryString = mystory.contents.toString();

	const regex = /\d{1,3}\/\d{1,3}|\([^\(\)]*\)\/\([^\(\)]*\)/g;

	const hogepiyo = (regex: RegExp, mystory: Story) => {
		const [replacedText, fractions] = extractTextInParentheses(mystoryString, regex);

		if (fractions.length === 0) return;
		mystory.contents = replacedText;
		const copyRightIndex = getMutchAllIndexes(replacedText, /©/g, (findText) => {});
		const copyRightText = mystory.contents;
		mystory.contents = copyRightText.replace(/©/g, "　");

		forloop(copyRightIndex.length, (index) => {
			const createdTextFrame = createTextFrame(selections[0], fractions[index]);
			insertSelectedTextFrameAsAnchorAtIndex(createdTextFrame, selections[1], copyRightIndex[index] + index);
		});
	};
	hogepiyo(regex, mystory);
	// const [replacedText, fractions] = extractTextInParentheses(mystoryString, regex);
	// extractTextInParentheses(mystoryString, /\([^\(\)]*\)\/\([^\(\)]*\)/g);
}
function extractTextInParentheses(str: string, regex: RegExp): [string, string[][]] {
	$.writeln("----");
	let replacedText = str;
	const fractions: string[][] = [];

	let find;
	getMutchAllIndexes(str, regex, (findText) => {
		const splitedTexts = findText.split("/");
		fractions.push(splitedTexts);
		$.writeln("---");
		/*@ts-ignore*/
		replacedText = replacedText.replace(findText, "©");
	});
	// $.writeln(replacedText);
	// $.writeln(fractions);
	return [replacedText, fractions];
}
function createTextFrame(textFrame: TextFrame, insertArray: string[]): TextFrame {
	/*@ts-ignore*/
	const duplicateTextFrame = textFrame.duplicate() as TextFrame;
	/*@ts-ignore*/
	const table = <table>duplicateTextFrame.tables[0];
	const insertFormatedArray = [removeBracketsAndSpace(insertArray[0]), removeBracketsAndSpace(insertArray[1])];

	table.contents = insertFormatedArray;
	return duplicateTextFrame;
}
function insertSelectedTextFrameAsAnchorAtIndex(insertTextFrame: TextFrame, toTextFrame: TextFrame, index: number) {
	const anchorTextFrame = insertTextFrame;
	const insertionPoint = toTextFrame.insertionPoints[index];
	// アンカーオブジェクトとして挿入
	anchorTextFrame.anchoredObjectSettings.insertAnchoredObject(insertionPoint, AnchorPosition.ANCHORED);
	anchorTextFrame.clearObjectStyleOverrides();
}
function getMutchAllIndexes(str: string, regex: RegExp, callBack: (arr: string) => void): number[] {
	const indexes = [];
	let find;
	while ((find = regex.exec(str)) !== null) {
		$.writeln("string " + find[0].toString());
		$.writeln("index " + find.index);
		const findText = find[0].toString();
		const index = find.index;
		indexes.push(index);
		callBack(findText);
	}
	return indexes;
}
function removeBracketsAndSpace(str: string): string {
	return str.replace(/\s/g, "").replace(/\(|\)/g, "");
}
main();
