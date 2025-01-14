// スラッシュ訳を流し込むスクリプト
// UTF-8 with BOM で保存されるか確認すること

import Polyfill from "./../_polyfill//Polyfill";
import { MyDialog, MyDialogInputTxt } from "./../_props//Dialog";
import { formatText } from "./../_props//TextFrameWrapper";

Polyfill();

class Selection {
	length: number = 0;
	type: string = "";
	constructor() {
		const obj = <object[]>app.activeDocument.selection;
		this.length = obj.length;
		this.type = obj.length > 0 ? obj[0].constructor.name : "";
	}
}
class slashReadingEntity {
	myNumberTextFrames: TextFrame[] = [];
	myTranslateTextFrames: TextFrame[] = [];
	constructor(textframe: TextFrame) {
		/*@ts-ignore*/
		const mystory = textframe.parentStory;
		/*@ts-ignore*/
		const myAnchorItems: PageItem[] = [...mystory.pageItems];
		/*@ts-ignore*/
		myAnchorItems.map((anchorItem) => {
			const element = anchorItem.getElements()[0];
			switch (element.constructor.name) {
				case "TextFrame":
					this.processTextFrame(element as TextFrame);
					break;
				case "Group":
					this.processGroup(element as Group);
					break;
				case "Rectangle":
					this.processRectangle(element as Rectangle);
					break;
				default:
					$.writeln("想定外のオブジェクトです " + element.constructor.name);
					break;
			}
		});
	}
	private processTextFrame(textFrame: TextFrame) {
		const bounds = textFrame.geometricBounds;
		const width = (bounds[3] as number) - (bounds[1] as number);
		width < 5 ? this.myNumberTextFrames.push(textFrame) : this.myTranslateTextFrames.push(textFrame);
	}
	private processGroup(group: Group) {
		this.myNumberTextFrames.push(group.textFrames[0]);
	}
	private processRectangle(rectangle: Rectangle) {
		//何もしない
	}
}
function main() {
	///////////////////////////
	// データの取得
	///////////////////////////
	const s = new Selection();
	if (s.length <= 0) return alert("何も選択されていません テキストフレームを選択してください");
	if (s.length !== 1 || s.type !== "TextFrame") return alert("テキストフレームを1つ選択してください");
	const dialog = new MyDialog("貼られたスラッシュ訳を流し込む");

	///////////////////////////
	// データの加工
	///////////////////////////
	const splitString = (input: string, splitRegex: RegExp = new RegExp(/[\r\n]+/)): string[] => {
		/*@ts-ignore*/
		return input.split(splitRegex).map((line) => line.replace(/^\s+/, "")); //入力を改行文字で分割
	};
	//入力されたテキストの最初の文字を削除（行頭の数字を削除）
	/*@ts-ignore*/
	const inputArray: any[] = splitString(dialog.input1).map((line, i) => {
		const regex: RegExp = !(i + 1 >= 10) ? new RegExp(`^.{1}`) : new RegExp(`^.{2}`);
		return line.replace(regex, "");
	});
	//データの中身を"　　"で分割
	/*@ts-ignore*/
	const splitedArray = inputArray.map((line) => splitString(line, new RegExp("　　")));

	///////////////////////////
	// エンティティの取得
	///////////////////////////
	/*@ts-ignore*/
	const _slashReadingEntity = new slashReadingEntity(app.activeDocument.selection[0]);

	///////////////////////////
	// データの流し込み
	///////////////////////////
	//頭数字のテキストフレームにテキストを流し込む
	const paragraphNumberLen = _slashReadingEntity.myNumberTextFrames.length;
	for (let i = 0; i < paragraphNumberLen; i++) {
		_slashReadingEntity.myNumberTextFrames[i].contents = (i + 1).toString();
	}
	//翻訳文をテキストフレームに流し込む
	let counter = 0;
	for (let i = 0; i < splitedArray.length; i++) {
		for (let j = 0; j < splitedArray[i].length; j++) {
			_slashReadingEntity.myTranslateTextFrames[counter].contents = splitedArray[i][j];
			counter++;
		}
	}
}

main();
