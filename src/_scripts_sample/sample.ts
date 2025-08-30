// UTF-8 with BOM で保存されるか確認すること

import Polyfill from "./../_polyfill//Polyfill";
import { MyDialog, MyDialogInputTxt } from "./../_props/Dialog";
import { formatText } from "./../_props/TextFrameWrapper";

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

///選択したテキストフレームにダイアログで入力したテキストを流し込むスクリプト

const main = () => {
	///////////////////////////
	// データの取得
	///////////////////////////
	const s = new Selection();
	if (s.length <= 0) return alert("何も選択されていません テキストフレームを選択してください");
	if (s.length !== 1 || s.type !== "TextFrame") return alert("テキストフレームを1つ選択してください");
	const dialog = new MyDialog("サンプルのダイアログ", "ラベルを入れられる :");

	$.writeln("dialog.input1 : " + dialog.input1);

	///////////////////////////
	// メイン処理/データの流し込み
	///////////////////////////

	if (s.type === "TextFrame" && dialog.input1 !== "") {
		/* @ts-ignore */
		const textframe = app.activeDocument.selection[0] as TextFrame;
		textframe.contents = dialog.input1;
	}
};

main();
