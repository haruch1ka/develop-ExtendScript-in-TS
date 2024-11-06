"use strict";
//アンカーボックス内に漢字とよみがなを流し込むスクリプト
//入力欄左に見出し語を、入力欄右に問題文をそれぞれエクセルからコピペしてくる。
//入力欄の数のみをコピペすること
//json2.jsxincはこのスクリプトと同じディレクトリに置いてください。
//オブジェクトスタイル名の"□解答欄_アンカー"と"正答率"を判別基準にしているので、スタイル名を変更すると動きません。
//名前を変更した場合は、スクリプト内のスタイル名を変更してください。
function forloop(times, func) {
	for (var i = 0; i < times; i++) {
		func(i);
	}
}
var myDialog = /** @class */ (function () {
	function myDialog(title) {
		this.obj = app.dialogs.add({ name: "".concat(title) });
		this.temp = this.obj.dialogColumns.add();
		this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
		this.obj.show();
	}
	return myDialog;
})();
var Input = /** @class */ (function () {
	function Input(myinput) {
		var input = myinput;
		input = input.replace(new RegExp(/^[\r\n]+/gm), "");
		input = input.replace(new RegExp(/[\x20\u3000]/gm), "");
		input = input.replace(" ", "");
		var regex = new RegExp(/[\r\n]+/);
		var inputArr = input.split(regex); //入力を改行文字で分割
		this.inputDataArray = inputArr;
	}
	return Input;
})();
var textFrames = /** @class */ (function () {
	function textFrames(TextFrames) {
		this.textFrames = TextFrames;
		this.contentsLength = this.textFrames.length;
	}
	textFrames.prototype.getStory = function () {
		var story;
		story = this.textFrames[0].parentStory;
		return story;
	};
	return textFrames;
})();
var Selection = /** @class */ (function () {
	function Selection() {
		this.type = "";
		this.is_selected = false;
		this.is_one = false;
		this.obj = app.activeDocument.selection;
		this.isSelected();
		if (this.is_selected) {
			this.gettype();
		}
	}
	Selection.prototype.gettype = function () {
		this.type = this.obj[0].constructor.name;
	};
	Selection.prototype.isSelected = function () {
		if (this.obj.length !== 0) {
			this.is_selected = true;
			this.is_one = this.isOne();
		} else {
			this.is_selected = false;
		}
	};
	Selection.prototype.isOne = function () {
		return this.obj.length === 1;
	};
	return Selection;
})();
function main() {
	var s = new Selection();
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
	var mydia = new myDialog("エクセルから%の列をコピーアンドペーストして下さい。");
	//editContentsはダイアログで入力された文字列
	//何も入れずキャンセルを弾く
	if (mydia.textObj.editContents == "") {
		return;
	}
	//改行された文字列を配列に変換
	var input = new Input(mydia.textObj.editContents);
	var processedData = input.inputDataArray;
	$.writeln("-----------------");
	// %の配列
	$.writeln(processedData);
	$.writeln("-----------------");
	var inputOnelen = processedData.length;
	var selectObj = app.activeDocument.selection;
	var _textFrames = new textFrames(app.activeDocument.selection);
	var mystory = _textFrames.getStory();
	var pageItemsLen = mystory.pageItems.length;
	// $.writeln("選択ストーリ内にあるアイテムの個数 " + pageItemsLen);
	var myAnchorItems = [];
	var pointAnchors = [];
	var isSeitouStyle = false;
	var isKaitouranStyle = false;
	for (var i = 0; i < pageItemsLen; i++) {
		var element = mystory.pageItems[i].getElements()[0];
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
	for (var i = 0; i < pointAnchors.length; i++) {
		var anchor = pointAnchors[i];
		var myTextFrame = pointAnchors[i].getElements()[0];
		removeOverset(myTextFrame);
		$.writeln(processedData[i] + "%");
		var insertText = processedData[i] + "％";
		myTextFrame.contents = NothingEnum.NOTHING; //初期化の処理ができるかどうか検証する//いつか
		myTextFrame.contents = insertText;
	}
}
main();
function removeOverset(textFrame) {
	if (textFrame.overflows) {
		var cb = textFrame.texts[0].insertionPoints.firstItem();
		var ce = textFrame.parentStory.texts[0].insertionPoints.lastItem();
		var item = textFrame.texts.itemByRange(cb, ce);
		if (item instanceof Text) {
			item.remove();
		} else {
			throw new Error("The returned item is not of type Text");
		}
	}
}
