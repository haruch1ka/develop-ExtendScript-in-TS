class MyDialogInputTxtLarge {
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
class MyDialogInputRadio {
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
export class MyDialogInputTxt {
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
export class MyDialog {
	obj: any;
	temp: any;
	input1: string;
	constructor(title: string, inputTitle: string = "入力値 :") {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		let _input1 = new MyDialogInputTxt(this.temp, inputTitle, "");
		this.obj.show();
		_input1.getInput();
		this.input1 = _input1.input;
	}
}
