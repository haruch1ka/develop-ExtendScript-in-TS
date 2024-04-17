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

let test = `P.16
P.17
P.17
P.18
○　P.20
P.20
○　P.21
P.21
P.21
P.21
○　P.22`;

type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
function replaceString(myInput: string) {
	let resString: string = "";
	let input = new Input(myInput);
	let resArr: string[][] = [];
	forloop(input.inputDataArray.length, (j) => {
		let string = String(input.inputDataArray[j]);
		let split = string.split("\t");
		// resArr.push(split);
		resString += split[1] + "\t" + split[0] + "\n";
	});
	return resString.slice(0, -1);
}

function replaceString2(myInput: string) {
	let resString: string = "";
	let input = new Input(myInput);
	let resArr: string[][] = [];
	let reg = new RegExp("○");
	let pastString = "";
	forloop(input.inputDataArray.length, (j) => {
		let string = String(input.inputDataArray[j]);
		let currentString = "";
		if (reg.test(string)) {
			let split = string.split("　");
			currentString = split[1];
		} else {
			currentString = string;
		}
		if (currentString == pastString) {
			resString += string.replace(currentString, "");
		} else {
			resString += string;
		}
		pastString = currentString;
	});
	return pastString;
}
