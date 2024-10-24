"use strict";
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
		this.input = this.textObj.editContents;
	}
	return myDialog;
})();
var Input = /** @class */ (function () {
	function Input(myinput) {
		var input = myinput;
		input = input.replace(new RegExp(/^[\r\n]+/gm), "");
		var regex = new RegExp(/[\r\n]+/);
		var inputArr = input.split(regex); //入力を改行文字で分割
		this.inputDataArray = inputArr;
	}
	Input.prototype.trimkanji = function (str) {
		var mystr = str;
		var res = [];
		for (var num = 4; num > 0; num--) {
			var reg = new RegExp("[\u4E00-\u9FFF]{" + num + "}", "g");
			do {
				var strindex = mystr.search(reg);
				if (strindex == -1) {
					break;
				}
				var pickupStr = mystr.slice(strindex, strindex + num);
				res.push(pickupStr);
				// $.writeln(pickupStr + " :target");
				mystr = mystr.replace(pickupStr, "");
			} while (mystr.search(reg) != -1);
		}
		return res;
	};
	Input.prototype.splitString = function (str, splitChar) {
		var res = str.split(splitChar);
		return res;
	};
	return Input;
})();
var textFrame = /** @class */ (function () {
	function textFrame(TextFrame) {
		this.textFrame = TextFrame;
	}
	textFrame.prototype.getStory = function () {
		var story;
		story = this.textFrame.parentStory;
		return story;
	};
	return textFrame;
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
	s.gettype();
	if (s.type !== "TextFrame") {
		alert("テキストフレームを選択してください");
		return;
	} else {
		// $.writeln(s.type);
	}
	/* @ts-ignore */
	var selections = app.activeDocument.selection;
	var _textFrame = new textFrame(selections[1]);
	var mystory = _textFrame.getStory();
	var mystoryString = mystory.contents.toString();
	var regex = /\w{1,3}\/\w{1,3}|\([^\(\)]*\)\/\([^\(\)]*\)/g;
	var hogepiyo = function (regex, mystory) {
		var _a = extractTextInParentheses(mystoryString, regex),
			replacedText = _a[0],
			fractions = _a[1];
		if (fractions.length === 0) return;
		mystory.contents = replacedText;
		var copyRightIndex = getMutchAllIndexes(replacedText, /©/g, function (findText) {});
		var copyRightText = mystory.contents;
		mystory.contents = copyRightText.replace(/©/g, "　");
		forloop(copyRightIndex.length, function (index) {
			var createdTextFrame = createTextFrame(selections[0], fractions[index]);
			insertSelectedTextFrameAsAnchorAtIndex(createdTextFrame, selections[1], copyRightIndex[index] + index);
		});
	};
	hogepiyo(regex, mystory);
	// const [replacedText, fractions] = extractTextInParentheses(mystoryString, regex);
	// extractTextInParentheses(mystoryString, /\([^\(\)]*\)\/\([^\(\)]*\)/g);
}
function extractTextInParentheses(str, regex) {
	$.writeln("----");
	var replacedText = str;
	var fractions = [];
	var find;
	getMutchAllIndexes(str, regex, function (findText) {
		var splitedTexts = findText.split("/");
		fractions.push(splitedTexts);
		$.writeln("---");
		/*@ts-ignore*/
		replacedText = replacedText.replace(findText, "©");
	});
	// $.writeln(replacedText);
	// $.writeln(fractions);
	return [replacedText, fractions];
}
function createTextFrame(textFrame, insertArray) {
	/*@ts-ignore*/
	var duplicateTextFrame = textFrame.duplicate();
	/*@ts-ignore*/
	var table = duplicateTextFrame.tables[0];
	var insertFormatedArray = [removeBracketsAndSpace(insertArray[0]), removeBracketsAndSpace(insertArray[1])];
	table.contents = insertFormatedArray;
	return duplicateTextFrame;
}
function insertSelectedTextFrameAsAnchorAtIndex(insertTextFrame, toTextFrame, index) {
	var anchorTextFrame = insertTextFrame;
	var insertionPoint = toTextFrame.insertionPoints[index];
	// アンカーオブジェクトとして挿入
	anchorTextFrame.anchoredObjectSettings.insertAnchoredObject(insertionPoint, AnchorPosition.ANCHORED);
	anchorTextFrame.clearObjectStyleOverrides();
}
function getMutchAllIndexes(str, regex, callBack) {
	var indexes = [];
	var find;
	while ((find = regex.exec(str)) !== null) {
		$.writeln("string " + find[0].toString());
		$.writeln("index " + find.index);
		var findText = find[0].toString();
		var index = find.index;
		indexes.push(index);
		callBack(findText);
	}
	return indexes;
}
function removeBracketsAndSpace(str) {
	return str.replace(/\s/g, "").replace(/\(|\)/g, "");
}
main();
