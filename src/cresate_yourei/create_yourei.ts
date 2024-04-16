type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
class myExcel {
	excelFilePath: string;
	splitChar: string;
	sheetNumber: string;
	constructor(excelFilePath: any, splitChar: string, sheetNumber: string) {
		this.excelFilePath = excelFilePath;
		this.splitChar = splitChar;
		this.sheetNumber = sheetNumber;
	}
	GetDataFromExcelPC() {
		try {
			if (typeof this.splitChar === "undefined") this.splitChar = ";";
			if (typeof this.sheetNumber === "undefined") this.sheetNumber = "1";
			let appVersionNum = Number(String(app.version).split(".")[0]),
				data: any = [];

			let vbs = "Public s, excelFilePath\r";
			vbs += "Function ReadFromExcel()\r";
			vbs += "On Error Resume Next\r";
			vbs += "Err.Clear\r";
			vbs += 'Set objExcel = CreateObject("Excel.Application")\r';
			vbs += 'Set objBook = objExcel.Workbooks.Open("' + this.excelFilePath + '")\r';
			vbs += "Set objSheet =  objExcel.ActiveWorkbook.WorkSheets(" + this.sheetNumber + ")\r";
			vbs += 's = s & "[" & objSheet.Name & "]"\r';
			vbs += "objExcel.Visible = True\r";
			vbs += "matrix = objSheet.UsedRange\r";
			vbs += "maxDim0 = UBound(matrix, 1)\r";
			vbs += "maxDim1 = UBound(matrix, 2)\r";
			vbs += "For i = 1 To maxDim0\r";
			vbs += "For j = 1 To 3\r";
			vbs += "If j = maxDim1 Then\r";
			vbs += "s = s & matrix(i, j)\r";
			vbs += "Else\r";
			vbs += 's = s & matrix(i, j) & "' + this.splitChar + '"\r';
			vbs += "End If\r";
			vbs += "Next\r";
			vbs += "s = s & vbCr\r";
			vbs += "Next\r";
			vbs += "objBook.Close\r";
			vbs += "Set objSheet = Nothing\r";
			vbs += "Set objBook = Nothing\r";
			vbs += "Set objExcel = Nothing\r";
			vbs += "SetArgValue()\r";
			vbs += "On Error Goto 0\r";
			vbs += "End Function\r";
			vbs += "Function SetArgValue()\r";
			vbs += 'Set objInDesign = CreateObject("InDesign.Application")\r';
			vbs += 'objInDesign.ScriptArgs.SetValue "excel_data", s\r';
			vbs += "End Function\r";
			vbs += "ReadFromExcel()\r";

			if (appVersionNum > 5) {
				// CS4 and above
				app.doScript(vbs, ScriptLanguage.VISUAL_BASIC, undefined, UndoModes.FAST_ENTIRE_SCRIPT);
			} else {
				// CS3 and below
				app.doScript(vbs, ScriptLanguage.VISUAL_BASIC);
			}

			let str = app.scriptArgs.getValue("excel_data");
			app.scriptArgs.clear();

			let tempArrLine,
				line,
				match,
				name,
				tempArrData = str.split("\r");

			for (let i = 0; i < tempArrData.length; i++) {
				line = tempArrData[i];
				if (line == "") continue;

				match = line.match(/^\[.+\]/);

				if (match != null) {
					name = match[0].replace(/\[|\]/g, "");
					line = line.replace(/^\[.+\]/, "");
				}

				tempArrLine = line.split(this.splitChar);
				data.name = name;
				data.push(tempArrLine);
			}

			return data;
		} catch (err: any) {
			$.writeln(err.message + ", line: " + err.line);
		}
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
	input1: any;
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		let _input1 = new myDialogInputTxt(this.temp, "検索する漢字 :", "飛");
		this.obj.show();
		_input1.getInput();
		this.input1 = _input1.input;
	}
}

class Input {
	mySelection: any;
	constructor(selection: any) {
		this.mySelection = selection;
	}
	showObjType() {
		let selObj: any = this.mySelection;
		for (let i: number = 0; i < selObj.length; i++) {
			let dType: string = selObj[i].constructor.name;

			$.writeln(`${dType}`);
		}
	}
	showInputObjType(input: any) {
		let dType: string = input.constructor.name;

		$.writeln(`${dType}`);
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
class Brakets {
	input: string = "";
	replaced: string = "";
	getBracketsItem(string: string, braketType: string): string[] | null {
		const reg = this.makeBraketReg(braketType);
		const match = string.match(reg);
		if (match == null) {
			return null;
		}
		let res: string[] = [];
		for (let i = 0; i < match.length; i++) {
			res.push(this.removeBrackets(match[i]));
		}
		return res;
	}
	removeBrackets(string: string): string {
		let reg = new RegExp(/[\[\]\《\》]/g);
		return string.replace(reg, "");
	}
	removeBracketsAndItem(string: string, BraketsType: string): string {
		let reg = this.makeBraketReg(BraketsType);
		return string.replace(reg, "");
	}
	makeBraketReg(BraketsType: string): RegExp {
		switch (BraketsType) {
			case "round":
				return new RegExp(/\(.*?\)/g);
			case "kagi":
				return new RegExp(/\「.*?\」/g);
			case "dAngle":
				return new RegExp(/\《.*?\》/g);
			default:
				throw new Error("no Brakets Type");
		}
	}
	getBracketsItemIndex(input: string): number[][] {
		let targetIndexArray = [];
		let start_index: number;
		let end_index: number;
		let reg1 = new RegExp(/[\(\[\《\<]/);
		let reg2 = new RegExp(/[\)\]\》\>]/);
		while (input.search(reg1) != -1) {
			start_index = input.search(reg1) + 1 - 1;
			end_index = input.search(reg2) - 1 - 1;
			input = input.replace(reg1, "");
			input = input.replace(reg2, "");
			targetIndexArray.push([start_index, end_index]);
		}
		return targetIndexArray;
	}
}
function main() {
	const mydialog = new myDialog("ここに対象の漢字一字を入力してください");
	const input = mydialog.input1;
	if (input == "" || input.length != 1) {
		return;
	}

	// const active_folder_path: string = decodeURI(String(app.activeDocument.filePath));
	// const save_folder = Folder(active_folder_path).selectDlg("フォルダを選択してください。");

	// const file = <File>File(active_folder_path).openDlg("ファイルを選択してください", "*.xlsx"); //完成時戻す

	const file = <File>(
		File(
			"D://backup//bunkei//文溪堂_2023年度//国語//国語テスト//国語テスト//01国語テスト本誌共通parts//こたえてびき漢字コメント//流し込み用(3-6年).xlsx"
		)
	);
	//テスト用
	if (!file) {
		return;
	}

	const [insertText, insertTar, tarLength] = getTargetData(input, file.fsName);

	$.writeln(insertText + " insertText");
	$.writeln(tarLength + " tarLength");
	hoge(insertText, tarLength);
}

function hoge(text: string, tarlen: number) {
	let insert = text;
	const selectObj = <Group[]>app.activeDocument.selection;
	const selectitem: any[] = selectObj[0].allPageItems;
	let selName;

	let rectangle: Rectangle;
	let textFrame: TextFrame;
	for (let i = 0; i < selectitem.length; i++) {
		const e = selectitem[i];

		if (e.constructor.name == "TextFrame") {
			//初期値の取得
			textFrame = <TextFrame>e;
			rectangle = <Rectangle>textFrame.parentStory.pageItems[0].getElements()[0];
			let rectArray: any[] = [];
			for (let i = 0; i < tarlen; i++) {
				let res = rectangle.duplicate([0, 0], [0, 0]);
				rectArray.push(res);
			}
			rectangle.remove();
			//値の入力

			insert = insert.replace(new RegExp(/\＊/g), "「＊」");
			let indexes: number[] = getAllIndexes(insert, "＊");
			insert = insert.replace(new RegExp(/\＊/g), "");
			textFrame.contents = insert;
			for (let j = 0; j < indexes.length; j++) {
				let myPictureAnchor: any = textFrame.insertionPoints[indexes[j]]; //挿入ポイント指定（検索文字の一個前）

				rectArray[j].anchoredObjectSettings.insertAnchoredObject(myPictureAnchor, AnchorPosition.ANCHORED);
				rectArray[j].clearObjectStyleOverrides();
			}
		}
	}
}
function getTargetData(inputKanji: string, fileName: string): [string, RegExpMatchArray | null, number] {
	let insertText: string = "";
	let insertTar: RegExpMatchArray | null = null;
	let tarLength: number = 0;
	for (let i = 1; i < 5; i++) {
		let excel_instance = new myExcel(fileName, ";", String(i));
		let excel_data = excel_instance.GetDataFromExcelPC();
		excel_data.shift();
		if (excel_data[0] == undefined) {
			break;
		}
		let col: any = excel_data;
		let yourei_txt: string = "";
		for (let j = 1; j < col.length; j++) {
			if (inputKanji == col[j][1]) {
				let replaced_text = col[j][2].replace(new RegExp(/×〔.*〕/), "");
				yourei_txt = replaced_text;
				break;
			}
		}
		if (yourei_txt != "") {
			let regKagi = new RegExp(/\「.*?\」/g);
			let regKou = new RegExp(/\〔.*?\〕/g);
			if (regKagi.test(yourei_txt)) {
				insertTar = yourei_txt.match(regKagi);
			} else if (regKou.test(yourei_txt)) {
				insertTar = <RegExpMatchArray>yourei_txt.match(regKou);
			} else {
				throw new Error("置き換えが見つからないよ");
				insertTar = null;
			}
			let replaceYourei = yourei_txt;
			if (insertTar != null) {
				tarLength = insertTar.length;
				for (let i = 0; i < insertTar.length; i++) {
					replaceYourei = replaceYourei.replace(insertTar[i], "＊");
				}
			}

			insertText = replaceYourei;
			$.writeln(insertText);
			$.writeln(insertTar);
			if (insertTar) alert(String(insertTar));
			break;
		}
	}
	return [insertText, insertTar, tarLength];
}
function getAllIndexes(string: string, val: string) {
	let indexes = [],
		i;
	for (i = 0; i < string.length; i++) {
		if (string.charAt(i) === val) indexes.push(i);
	}
	return indexes;
}
function anchoredIn(story: any): any {
	let ancObj: any;
	ancObj = story.add();
	ancObj.visibleBounds = ["0 mm", "0 mm", "4mm", "4 mm"];
	//ancObj.rotationAngle = 90;
	// ancObj.place(Item);
	ancObj.appliedObjectStyle = app.activeDocument.objectStyles.item("インライン基本");
	return ancObj;
}
main();
