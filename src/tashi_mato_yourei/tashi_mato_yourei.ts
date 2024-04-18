// Type: TypeScript File
//ダイアログ表示のおまじない
app.scriptPreferences.userInteractionLevel = 1699311169;
type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}

class myFileSetting {
	//field
	my_confirmation: boolean; //処理前に確認ダイアログを表示するかどうか
	my_save_folder_path: string = ""; //PDF保存フォルダ（あとで設定）
	my_save_folder_path2: string = ""; //PDF保存フォルダ（あとで設定）
	my_digitnum: number = 4; //ノンブルが数値だったら、桁を揃える。2=>002, 45=>045, 123=>123
	my_config_filename: string = ""; //設定ファイル名
	my_separator: string = ""; //パスの区切り文字
	my_activescript_path: string = ""; //このスクリプトのパス
	my_activescript_folder: Folder; //このスクリプトのコンテナフォルダ
	my_config_path: string = ""; //設定ファイルのフルパス
	actDocFolder: Folder; // アクティブなドキュメントの入っているフォルダ
	f_modified: boolean = false; //ファイルを書き込んだかどうかのフラグ（余計な読み書き回数を減らすために）

	//constructor
	constructor(my_confirmation: boolean, my_config_filename: string) {
		this.my_confirmation = my_confirmation;
		this.my_config_filename = my_config_filename;
		this.my_separator = this.get_separator();
		this.my_activescript_path = this.get_my_script_path();
		this.my_activescript_folder = File(this.my_activescript_path).parent;
		this.my_config_path = this.my_activescript_folder + this.my_separator + this.my_config_filename;
		this.actDocFolder = Folder(String(app.activeDocument.filePath));

		//設定ファイルがなかったら
		if (File(this.my_config_path).exists === false) {
			this.f_modified = this.write_setting(this.my_config_path); //設定して書き込み
		}

		//設定ファイルの読み出し
		let my_data_list_string: string = this.read_file(this.my_config_path);
		let my_data_list: string[] = my_data_list_string.split(/[\r\n]+/);
		this.my_save_folder_path = my_data_list[1];
		this.my_save_folder_path2 = my_data_list[2];
	}
	//カレントスクリプトのフルパスを得る
	get_my_script_path(): string {
		try {
			return String(app.activeScript);
		} catch (e: any) {
			return String(File(e.fileName)); //ESTKから実行した時も正しくパスを返す
		}
	}

	//ファイルの内容を読み込んで返す
	read_file(my_read_file_path: string): string {
		let my_file_obj: File = new File(my_read_file_path);
		if (!my_file_obj.exists) {
			throw new Error("ファイルがありません\n" + my_read_file_path);
		}
		let tmp_str: string = "";
		if (my_file_obj.open("r")) {
			tmp_str = my_file_obj.read();
			my_file_obj.close();
		} else {
			throw new Error("ファイルが開けません\n" + my_read_file_path);
		}
		tmp_str = tmp_str.replace(/[\r\n]+$/, ""); //最後の行末の改行を削除
		return tmp_str;
	}
	//データをファイルに書き込む 。書き込んだファイルオブジェクトを返す
	write_file(my_write_file_path: string, my_data: string): File {
		let my_file_obj: File = new File(my_write_file_path);
		my_file_obj.encoding = "UTF-8"; //★この行がないとShift-JISで書き出される
		if (my_file_obj.open("w")) {
			my_file_obj.write(my_data);
			my_file_obj.close();
			return my_file_obj;
		} else {
			throw new Error("ファイルが開けません\n" + my_write_file_path);
		}
	}

	//初期設定＆設定ファイル書き込み
	write_setting(my_write_file_path: string): boolean {
		let tmp_data: string = "\r";
		let myPath: string = this.chooseF("Partsが保存してあるフォルダを選んでください");
		let myPath2: string = this.chooseFi("excelファイルを選んでください");
		//alert ("保存先\n"+myPath);
		tmp_data += myPath + "\r\n";
		tmp_data += myPath2 + "\r\n";
		this.write_file(my_write_file_path, tmp_data);
		return true; //書き込み済みであることのフラグ
	}

	//OSのファイルセパレータを得る
	get_separator(): string {
		if (Folder.fs === "Macintosh") {
			return "/";
		} else {
			return "\\";
		}
	}

	//ファイル・フォルダ選択ダイアログ。パス文字列を返す。
	chooseF(my_prompt: string): string {
		const active_folder_path: string = decodeURI(String(app.activeDocument.filePath));
		let my_pathx = Folder(active_folder_path).selectDlg(my_prompt);
		let decoded = decodeURI(String(my_pathx));
		return decoded;
	}
	chooseFi(my_prompt: string): string {
		const active_folder_path: string = decodeURI(String(app.activeDocument.filePath));
		let my_pathx = File(active_folder_path).openDlg(my_prompt);
		let decoded = decodeURI(String(my_pathx));
		return decoded;
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
	exsist: boolean = false;
	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		let _input1 = new myDialogInputTxt(this.temp, "エクセルの内容 :", "");
		this.obj.show();
		_input1.getInput();
		this.input1 = _input1.input;
		if (this.input1 !== "") this.exsist = true;
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
	selection_length: number = 0;
	constructor() {
		this.obj = <object[]>app.activeDocument.selection;
		this.isSelected();
		if (this.is_selected) {
			this.gettype();
			this.getSelectionLength();
		}
	}
	gettype() {
		this.type = this.obj[0].constructor.name;
	}
	isSelected() {
		if (this.obj.length !== 0) {
			this.is_selected = true;
		} else {
			this.is_selected = false;
		}
	}
	getSelectionLength() {
		this.selection_length = this.obj.length;
	}
	alert(bool: boolean, message: string): boolean {
		if (bool) {
			alert(message);
			return true;
		} else {
			return false;
		}
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
		let reg = new RegExp(/[\[\]\《\》\「\」]/g);
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
	let setting = new myFileSetting(false, "my_setting.txt");

	//オブジェクトが取得されているか確認する。
	const s = new Selection();
	if (s.alert(!s.is_selected, "オブジェクトが選択されていません")) return;
	if (s.alert(!(s.selection_length == 2), "2つグループを選択してください")) return;
	s.gettype();
	if (s.alert(s.type !== "Group", "グループを選択してください")) return;
	$.writeln(s.type);

	//入力ダイアログを表示する。
	const mydialog = new myDialog("たしまと用例スクリプト");
	if (!mydialog.exsist) return;
	const input = mydialog.input1;

	//選択されたグループからテキストフレームを取得する。
	const group = <Group>s.obj[0];
	const selectItem: PageItem[] = group.allPageItems;
	let textframe!: TextFrame;
	forloop(selectItem.length, (i) => {
		const e = selectItem[i];
		if (e.constructor.name == "TextFrame") {
			textframe = <TextFrame>e;
			return;
		}
	});
	if (!textframe) {
		return;
	}
	let excelFilePath = setting.my_save_folder_path2;
	let excelfile = new File(excelFilePath);

	//stringの最後から2番目の文字を取得する。
	let grade = setting.my_save_folder_path.slice(-2);
	$.writeln(grade);
	let isOneTwo;
	if (grade == "1年" || grade == "2年") {
		isOneTwo = true;
	} else {
		isOneTwo = false;
	}

	const [insertText, insertFileItemName, tarLength] = getTargetData(input, excelfile.fsName, isOneTwo);

	// let insertText: string = "＊の下に＊を書くよ。";
	// let insertFileItemName: string[] = ["6年_S裏S2_2020", "6年_S裏S3_2020"];
	// let tarLength: number = 2;

	$.writeln(insertText + " insertText");
	$.writeln(String(insertFileItemName) + " insertFileItemName");
	$.writeln(tarLength + " tarLength");

	// let illustratorFolderPath = setting.my_save_folder_path + setting.my_separator;

	// insertDataToTextFrame(textframe, insertText, tarLength, insertFileItemName, illustratorFolderPath);
}
//指定された漢字のデータをexcelから取得する関数。
function getTargetData(inputKanji: string, fileName: string, isOneTwo: boolean): [string, string[], number] {
	let insertText: string = "";
	let insertFileItemName: string[] = [];
	let tarLength: number = 0;
	let excel_data_array: string[][][] = [];
	forloop(5, (i) => {
		let excel_instance = new myExcel(fileName, ";", String(i));
		let excel_data = excel_instance.GetDataFromExcelPC();
		excel_data_array.push(excel_data);
		// excelデータが取得できなかった場合は処理を終了する。
		if (excel_data[0] == undefined) {
			return;
		}
	});

	forloop(excel_data_array.length, (i) => {
		let excel_data = excel_data_array[i];
		let targetRow = 1;
		if (isOneTwo) {
			targetRow = 0;
		}
		// excelデータの1行目は必要ないため削除する。
		excel_data.shift();

		let col: string[][] = excel_data;
		let yourei_txt: string = "";

		// x〔〕の部分を削除する。
		forloop(col.length, (j) => {
			$.writeln(col[j][targetRow]);

			if (inputKanji == col[j][targetRow]) {
				let replaced_text = col[j][targetRow + 1].replace(new RegExp(/×〔.*〕/), "");
				yourei_txt = replaced_text;
				return;
			}
		});
		// excelデータから正規表現で指定された文字列を取得する。
		if (yourei_txt != "") {
			let quotationRegex = new RegExp(/\「.*?\」/g);
			let bracketRegex = new RegExp(/\〔.*?\〕/g);
			if (quotationRegex.test(yourei_txt)) {
				let match = yourei_txt.match(quotationRegex);
				if (match) insertFileItemName = match;
			} else if (bracketRegex.test(yourei_txt)) {
				let match = yourei_txt.match(bracketRegex);
				if (match) insertFileItemName = match;
			} else {
				insertFileItemName = [];
			}
			let replaced_Yourei = yourei_txt;

			// 指定された文字列の部分を「＊」に置き換える。
			if (insertFileItemName != null && insertFileItemName.length > 0) {
				tarLength = insertFileItemName.length;
				forloop(insertFileItemName.length, (i) => {
					replaced_Yourei = replaced_Yourei.replace(insertFileItemName[i], "＊");
				});
			}
			insertText = replaced_Yourei;
			return;
		}
	});
	if (insertFileItemName) $.writeln(String(insertFileItemName));
	return [insertText, insertFileItemName, tarLength];
}
//テキストフレームに指定された文字列を挿入する関数。
function insertDataToTextFrame(
	textFrame: TextFrame,
	text: string,
	tarlen: number,
	insertFileItemName: string[],
	illustratorFolderPath: string
) {
	let insert = text;

	//rectangleを生成する。
	let rectangle: Rectangle;
	rectangle = app.activeDocument.pages[0].rectangles.add();
	rectangle.visibleBounds = ["0 mm", "0 mm", "4mm", "4 mm"];
	rectangle.clearObjectStyleOverrides();
	rectangle.fillColor = "Black";
	rectangle.strokeWeight = 0;
	rectangle.strokeColor = "None";
	rectangle.contentType = ContentType.GRAPHIC_TYPE;

	let brakets = new Brakets();
	let rectArray: any[] = [];
	for (let i = 0; i < tarlen; i++) {
		let insertFileName = brakets.removeBrackets(insertFileItemName[i]);
		let insertFile = File(illustratorFolderPath + String(insertFileName) + ".ai");
		let res = rectangle.duplicate([0, 0], [0, 0]);
		res.place(insertFile);
		res.fit(FitOptions.CONTENT_TO_FRAME);
		rectArray.push(res);
	}
	rectangle.remove();
	//値の入力

	insert = insert.replace(new RegExp(/\＊/g), "「＊」");
	let indexes: number[] = getAllIndexes(insert, "＊");
	insert = insert.replace(new RegExp(/\＊/g), "");
	//textFrame に文字列を挿入する。
	textFrame.contents = insert;
	for (let j = 0; j < indexes.length; j++) {
		let myPictureAnchor: any = textFrame.insertionPoints[indexes[j]]; //挿入ポイント指定（検索文字の一個前）
		rectArray[j].anchoredObjectSettings.insertAnchoredObject(myPictureAnchor, AnchorPosition.ANCHORED);
		rectArray[j].clearObjectStyleOverrides();
	}
}

//指定された文字列の指定された文字のインデックスを取得する関数。
function getAllIndexes(string: string, val: string) {
	let indexes = [],
		i;
	for (i = 0; i < string.length; i++) {
		if (string.charAt(i) === val) indexes.push(i);
	}
	return indexes;
}
//オブジェクトに指定されたアイテムを挿入する関数。
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

function test() {
	let setting = new myFileSetting(false, "my_setting.txt");

	//目的のオブジェクトが選択されているか確認する。
	const s = new Selection();
	if (s.alert(!s.is_selected, "オブジェクトが選択されていません")) return;
	if (s.alert(!(s.selection_length == 2), "2つグループを選択してください")) return;
	s.gettype();
	if (s.alert(s.type !== "Group", "グループを選択してください")) return;
	$.writeln(s.type);

	//入力ダイアログを表示する。
	const mydialog = new myDialog("たしまと用例スクリプト");
	if (!mydialog.exsist) return;
	const input = mydialog.input1;

	//入力された文字列を配列に変換する。
	const _input = new Input(input);
	const input_row_array: string[][] = [];
	forloop(_input.inputDataArray.length, (i) => {
		let res = _input.splitString(_input.inputDataArray[i], "	");
		if (res[res.length - 1] != "") input_row_array.push([res[0], res[res.length - 1]]);
	});
	//字形コメントの文字列をもとに、グループオブジェクトを複製する。
	let groupObjArray: PageItem[] = [];
	const rightGroup = <Group>s.obj[0];
	const leftGroup = <Group>s.obj[1];
	let diffLR = <number>rightGroup.geometricBounds[3] - <number>leftGroup.geometricBounds[3];
	let x = 0;
	forloop(input_row_array.length, (i) => {
		let diff = -20;
		if (input_row_array[i][1] == "右") {
			groupObjArray.push(rightGroup.duplicate(undefined, [x, 60]));
		} else {
			groupObjArray.push(leftGroup.duplicate(undefined, [x + diffLR, 60]));
		}
		x += diff;
	});
}
// test();
