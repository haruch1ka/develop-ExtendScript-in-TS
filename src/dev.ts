"use strict";

/*@ts-ignore*/
Array.prototype.map = function (callback: Function, thisArg: any) {
	if (typeof this.length != "number") return;
	if (typeof callback != "function") return;

	var newArr = [];

	if (typeof this == "object") {
		for (var i = 0; i < this.length; i++) {
			if (i in this) {
				/*@ts-ignore*/
				newArr[i] = callback.call(thisArg || this, this[i], i, this);
			} else {
				return;
			}
		}
	}

	return newArr;
};
//
//エンジニアの方へ... このスクリプトは、.tsで書かれたものを.jsへコンパイルして製作されています。
//githabにscriptのリソースをアップロードしているので、開発者の方はそちらを参照してください。
//

class calendar {
	year: number;
	monthDays: number[];
	constructor(year: number) {
		this.year = year;
		this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 月の日数
		if (this.isLeapYear()) this.monthDays[1] = 29; // うるう年
	}
	isLeapYear(): boolean {
		if (this.year % 400 === 0) return true;
		if (this.year % 100 === 0) return false;
		if (this.year % 4 === 0) return true;
		return false;
	}
	getYoubi(year: number, month: number, day: number): number {
		const d = new Date(year, month - 1, day);
		return d.getDay();
	}
	getMonthText(year: number, month: number) {
		const youbi = this.getYoubi(year, month, 1);
	}
}
class monthText {
	daysTextArray: string[] = [];
	beforeDashArray: string[] = [];
	afterDashArray: string[] = [];
	constructor(month: number, year: number, cal: calendar) {
		// /*@ts-ignore*/
		// $.writeln(month, year);
		//数字で曜日を取得
		const youbi = cal.getYoubi(year, month, 1);

		/*@ts-ignore*/
		[...Array(youbi)].map(() => this.beforeDashArray.push("..."));
		/*@ts-ignore*/
		[...Array(cal.monthDays[month - 1])].map((_, i) => this.daysTextArray.push(String(i + 1)));
		const length = this.daysTextArray.length;
		const diff = 35 - (youbi + length);
		if (diff > 0) {
			/*@ts-ignore*/
			[...Array(diff)].map(() => this.afterDashArray.push("..."));
		} else if (diff < 0) {
			/*@ts-ignore*/
			const diffArray = [...Array(-diff)].map(() => this.daysTextArray.pop());
			/*@ts-ignore*/
			diffArray.reverse();
			const counter = 0;
			/*@ts-ignore*/
			diffArray.map((v, i) => {
				const place = 29 - youbi + i * 2;
				this.daysTextArray.splice(place, 0, v);
			});
		}
		// /*@ts-ignore*/
		// $.writeln(this.beforeDashArray);
		// /*@ts-ignore*/
		// $.writeln(this.daysTextArray);
		// /*@ts-ignore*/
		// $.writeln(this.afterDashArray);
	}
}
class stockText {
	beforeTextArray: string[] = [];
	mainTextArray: string[] = [];
	afterTextArray: string[] = [];
	stockText(_monthTextInstance: monthText) {
		const beforeText = this.makeText(_monthTextInstance.beforeDashArray).slice(0, -1); //beforeTextの最後の改行を削除
		const mainText = this.makeText(_monthTextInstance.daysTextArray).slice(0, -1); //mainTextの最後の改行を削除
		const afterText = this.makeText(_monthTextInstance.afterDashArray); //afterTextの最後の改行を削除
		this.beforeTextArray.push(beforeText);
		this.mainTextArray.push(mainText);
		this.afterTextArray.push(afterText);
	}
	makeText(textArray: string[]): string {
		let text = "";
		for (let i = 0; i < textArray.length; i++) {
			text += textArray[i] + "\r";
		}
		return text;
	}
}
const createCalTexts = (pages: any) => {
	const _stockText = new stockText();
	for (let j = 0; j < pages.length; j++) {
		const year = 2025;
		const pageIndex = j;
		const tarYear = j > 11 ? year + 1 : year;
		const tarMonth = j > 11 ? j - 11 : j + 1;
		// /*@ts-ignore*/
		$.writeln("year :" + tarYear + " " + "month :" + tarMonth);
		// new monthText(tarMonth, tarYear);
		/*ページのアイテム要素の収集 */
		const page = pages[pageIndex];
		const _monthText = new monthText(tarMonth, tarYear, new calendar(tarYear));
		_stockText.stockText(_monthText);
	}
	// for (let i = 0; i < _stockText.beforeTextArray.length; i++) {
	// 	$.writeln("--------------------");
	// 	$.writeln(_stockText.beforeTextArray[i]);
	// 	$.writeln("--------------------");
	// }
	return _stockText;
};
const calTexts = createCalTexts(app.activeDocument.pages);

const txf1a = app.activeDocument.pages[0].textFrames.itemByName("txf1a");
const story = txf1a.parentStory;
for (let i = 0; i < calTexts.mainTextArray.length; i++) {
	story.insertionPoints[-1].contents = calTexts.mainTextArray[i];
	story.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;
}
/*@ts-ignore*/
story.characters.everyItem().appliedCharacterStyle = app.activeDocument.characterStyles[0];
story.clearOverrides(); //Story上のオーバーライドを一括消去

// const getPageItems = (page: any) => {
// 	const textFrames = [...page.textFrames];
// 	textFrames.pop();
// 	return textFrames.reverse();
// };
// const items = getPageItems(page);

// story.insertionPoints[0].contents = beforeText;
// story.insertionPoints[-1].contents = afterText;
// story.insertionPoints[-1].contents = SpecialCharacters.PAGE_BREAK;

/*土日にスタイルを適用*/

// const applyParaStyle = (page: any) => {
// 	const sunNameList = ["txf1a", "txf2a", "txf3a", "txf4a", "txf5a"];
// 	const satNameList = ["txf1g", "txf2g", "txf3g", "txf4g", "txf5g"];
// 	let [sunItemList, satItemList] = [[], []];
// 	for (let i = 0; i < sunNameList.length; i++) {
// 		const sunItem = page.pageItems.itemByName(sunNameList[i]);
// 		const sunTextFrames: any = sunItem.getElements();
// 		sunTextFrames[0].characters.everyItem().appliedCharacterStyle = app.activeDocument.characterStyles[2];
// 	}
// 	for (let i = 0; i < satNameList.length; i++) {
// 		const satItem = page.pageItems.itemByName(satNameList[i]);
// 		const satTextFrames: any = satItem.getElements();
// 		satTextFrames[0].characters.everyItem().appliedCharacterStyle = app.activeDocument.characterStyles[3];
// 	}
// };
// applyParaStyle(page);
//

/*入力のダイアログを表示*/

// class myDialogInputTxt {
// 	row: any;
// 	inputObj: any;
// 	input: any;
// 	constructor(targetObj: any, inputTitle: string, editText: string) {
// 		this.row = targetObj.dialogRows.add();
// 		let inputDiscription = this.row.dialogColumns.add();
// 		inputDiscription.staticTexts.add({ staticLabel: `${inputTitle}` });
// 		this.inputObj = this.row.textEditboxes.add({ editContents: `${editText}`, minWidth: 80 });
// 	}
// 	getInput() {
// 		this.input = this.inputObj.editContents;
// 	}
// }
// class myDialog {
// 	obj: any;
// 	temp: any;
// 	input1: string;
// 	constructor(title: string) {
// 		this.obj = app.dialogs.add({ name: `${title}` });
// 		this.temp = this.obj.dialogColumns.add();
// 		let _input1 = new myDialogInputTxt(this.temp, "祝日 :", "");
// 		this.obj.show();
// 		_input1.getInput();
// 		this.input1 = _input1.input;
// 	}
// }
// class Input {
// 	inputDataArray: string[];
// 	constructor(myinput: string) {
// 		let input = myinput;
// 		input = input.replace(new RegExp(/^[\r\n]+/gm), "");
// 		const regex = new RegExp(/[\r\n]+/);
// 		//inputに改行文字が含まれているかチェックする正規表現を使って
// 		/*@ts-ignore*/
// 		if (!regex.test(input)) throw new Error("改行文字が含まれていません");
// 		const inputArr = input.split(regex); //入力を改行文字で分割

// 		this.inputDataArray = inputArr;
// 	}
// 	removeRokuyou(target: string[]) {
// 		/*@ts-ignore*/
// 		return target.map((v, i) => {
// 			if (v.match(/先勝|友引|先負|仏滅|大安|赤口/)) {
// 				//後ろから三文字を削除
// 				target[i] = v.slice(0, -3);
// 			}
// 		});
// 	}
// }

// const dialog = new myDialog("祝日を入力");
// const dialogInput = dialog.input1;
// if (dialogInput === "") {
// 	/*@ts-ignore*/
// 	exit();
// }
// const inputArray = new Input(dialogInput).inputDataArray;
// /*@ts-ignore*/
// $.writeln(inputArray.length);
// // //文字データを改行で分割して配列に格納
// // /*@ts-ignore*/
// // $.writeln(inputArray);
