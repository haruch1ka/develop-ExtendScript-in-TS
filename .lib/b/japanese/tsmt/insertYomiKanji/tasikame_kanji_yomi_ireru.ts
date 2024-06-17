#include json2.jsxinc
//アンカーボックス内に漢字とよみがなを流し込むスクリプト
//入力欄左に見出し語を、入力欄右に問題文をそれぞれエクセルからコピペしてくる。
//入力欄の数のみをコピペすること
//json2.jsxincはこのスクリプトと同じディレクトリに置いてください。
//オブジェクトスタイル名の"□解答欄_アンカー"と"正答率"を判別基準にしているので、スタイル名を変更すると動きません。
//名前を変更した場合は、スクリプト内のスタイル名を変更してください。


let fugaPro;
type forloop = (index: number) => void;
function forloop(times: number, func: forloop) {
	for (let i = 0; i < times; i++) {
		func(i);
	}
}
class myDialog {
	obj: any;
	temp: any;
	temp2: any;

	textObj: any;
	textObj2: any;

	constructor(title: string) {
		this.obj = app.dialogs.add({ name: `${title}` });
		this.temp = this.obj.dialogColumns.add();
		this.temp2 = this.obj.dialogColumns.add();

		this.textObj = this.temp.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });
		this.textObj2 = this.temp2.textEditboxes.add({ editContents: "", minWidth: 200, multilene: true });

		this.obj.show();
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
				// $.writeln(mystr + " :replaced");
			} while (mystr.search(reg) != -1);
		}
		return res;
	}

	trimforeach(): any {
		let res = [];
		for (let i = 0; i < this.inputDataArray.length; i++) {
			res.push(this.trimkanji(this.inputDataArray[i]));
		}
		return res;
	}
	show() {
		for (let i = 0; i < this.inputDataArray.length; i++) {
			this.trimkanji(this.inputDataArray[i]);
		}
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
class process {
	processedArray: string[];
	input_one: string[];
	input_two: string[];

	constructor(midashi: Input, mondai: Input) {
		this.input_one = midashi.trimforeach();
		this.input_two = mondai.trimforeach();
		const resArr: string[] = [];

		for (let i = 0; i < this.input_one.length; i++) {
			let res = this.filter(this.input_one[i], this.input_two[i]);
			// $.writeln(res);
			resArr.push(res);
		}
		this.processedArray = resArr;
	}
	filter(element: string, array: string) {
		let res = "";
		for (let i: number = 0; i < array.length; i++) {
			if (array[i].indexOf(element) !== -1) {
				return array[i];
			}
		}
		return res;
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
	let mydia = new myDialog("左側に見出し語を右側に問題を入れてください。");
	// $.writeln(mydia.textObj.editContents);
	// $.writeln(mydia.textObj2.editContents);
	//editContentsはダイアログで入力された文字列
	//何も入れずキャンセルを弾く
	if (mydia.textObj.editContents == "" || mydia.textObj2.editContents == "") {
		return;
	}
	//改行された文字列を配列に変換
	const processedData = new process(new Input(mydia.textObj.editContents), new Input(mydia.textObj2.editContents));
	$.writeln("-----------------");
	// 空欄に入る漢字の配列
	$.writeln(processedData.input_one);
	// 問題文の配列
	$.writeln(processedData.input_two);
	$.writeln("-----------------");

	//yahooAPIへpost 及び取得したrubyのjsonを取得
	//改行文字が含まれるとエラーになるので置換
	let input = mydia.textObj2.editContents.replace(/[\r\n]/g, "*");
    input = input.replace(/\r\n/g, "*");
    input = input.replace(/。/g, "*");

	let res = httpRequest(input);
	// $.writeln(res);
	
	//jsonをパース
	let myjson = JSON.parse(res);
	const FuriganaArray =  getFurigana(myjson, processedData.input_one);

	let inputOnelen = processedData.input_one.length;
	let inputTwolen = processedData.input_two.length;

	const selectObj = <object[]>app.activeDocument.selection;
	const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
	const mystory = <Story>_textFrames.getStory();

	const pageItemsLen = mystory.pageItems.length;
	// $.writeln("選択ストーリ内にあるアイテムの個数 " + pageItemsLen);
	const myAnchorItems: PageItem[] = [];
	const pointAnchors: PageItem[] = [];
	if (pageItemsLen > 50) {
		let isSeitouStyle =false;
		let isKaitouranStyle = false;	
		for (let i = 0; i < pageItemsLen; i++) {
			let element = mystory.pageItems[i].getElements()[0];
			if (element.appliedObjectStyle.name == "正答率") {
				let element = mystory.pageItems[i].getElements()[0];
				$.writeln(element.appliedObjectStyle.name);
				pointAnchors.push(mystory.pageItems[i]);
				isSeitouStyle = true;
				
			} else if(element.appliedObjectStyle.name == "□解答欄_アンカー") {
				$.writeln(element.appliedObjectStyle.name);
				myAnchorItems.push(mystory.pageItems[i]);
				isKaitouranStyle = true;
			}else{
				$.writeln(element.appliedObjectStyle.name + " プログラムが認識していないスタイル");
			}
		}
	} else {
		for (let i = 0; i < pageItemsLen; i++) {
			myAnchorItems.push(mystory.pageItems[i]);
		}
	}

	//入力に間違いが無いか(チェック甘め)
	$.writeln("左側ダイアログに入力された漢字数 " + inputOnelen);
	$.writeln("ストーリ内にある解答欄の個数 " + myAnchorItems.length);
	$.writeln("右側ダイアログに入力された問題数 " + inputTwolen);
	alert("正答率アンカーオブジェクトの数  " + pointAnchors.length);
	alert("解答欄アンカーオブジェクトの数  " + myAnchorItems.length);
	//入力に間違いが無いか(チェック甘め)
	if (inputOnelen < 10) {
		alert("入力漢字数が少なすぎます。");
		return;
	}
	// if (inputTwolen != myAnchorItems.length) {
	// 	alert("アンカーアイテムと漢字数がちがいます。" + "アンカー数 " + myAnchorItems.length + "漢字数 " + inputOnelen);
	// 	return;
	// }
	if (inputOnelen != inputTwolen) {
		alert("入力された見出し漢字と問題の数が違います");
		return;
	}

	$.writeln(myAnchorItems.length + " mystory page item");
	//解答欄アンカーオブジェクトへの入力処理
	for (let i: number = 0; i < myAnchorItems.length; i++) {
		let anchor = myAnchorItems[i];
		switch (anchor.pageItems.length) {
			case 2: {
				let item = <TextFrame>anchor.pageItems[0].getElements()[0];
				let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];
				// $.writeln(item.contents); //読み ex.(し)
				// $.writeln(item2.contents); //漢字ー文字　ex.(詩)
				// $.writeln("one");

				// let insert: string = "　";
				let yomiRuby = FuriganaArray[i];
				let insert: string = String(processedData.input_one[i]);
				item.contents = yomiRuby;
				item2.contents = insert;
				break;
			}
			case 3: {
				let item = <TextFrame>anchor.pageItems[0].getElements()[0];
				let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];
				let item3 = <TextFrame>anchor.pageItems[2].pageItems[1].getElements()[0];
				// $.writeln(item.contents); //読み1 ex.(しょく)
				// $.writeln(item2.contents); //読み0 ex.(てい)
				// $.writeln(item3.contents); //漢字二文字　ex.(定食)

				// let insert = "　　";
				let yomiRuby = FuriganaArray[i];
				let insert = processedData.processedArray[i];
				item.contents = "";
				item2.contents = yomiRuby;
				item3.contents = insert;
				break;
			}
			case 6: {
				// let item = <TextFrame>anchor.pageItems[0].getElements()[0];// これはobject GraphicLine
				// let item2 = <TextFrame>anchor.pageItems[1].getElements()[0];// これはobject GraphicLine
				let item3 = <TextFrame>anchor.pageItems[2].getElements()[0];
				let item4 = <TextFrame>anchor.pageItems[3].getElements()[0];
				let item5 = <TextFrame>anchor.pageItems[4].getElements()[0];
				let item6 = <TextFrame>anchor.pageItems[5].getElements()[0];
				// $.writeln(item);
				// $.writeln(item2);
				// $.writeln(item3.contents); //読み2 ex.(かん)
				// $.writeln(item4.contents); //読み1 ex.(しょ)
				// $.writeln(item5.contents); //読み0 ex.(と)
				// $.writeln(item6.contents); //漢字三文字　ex.(図書館)

				// let insert = "　　";
				let yomiRuby = FuriganaArray[i];
				let insert = processedData.processedArray[i];
				item3.contents = "";
				item4.contents = "";
				item5.contents = yomiRuby;
				item6.contents = insert;
				break;
			}
			default:
				break;
		}
	}
}

//httpリクエストを送るVBSスクリプト
function httpRequest(input: string): string {
	let result = "";
	let kanji = input;
	let vbstotosute = "";
	vbstotosute += "Public s\r";
	vbstotosute += 'Dim http: Set http = CreateObject("WinHttp.WinHttpRequest.5.1")\r';
	vbstotosute += 'Dim url: url = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana"\r';
	vbstotosute +=
		'Dim data : data = "{ ""id"": ""1234-1"", ""jsonrpc"": ""2.0"", ""method"": ""jlp.furiganaservice.furigana"", ""params"": { ""q"": ""' +
		kanji +
		'"", ""grade"": ""1"" } }"\r';
	vbstotosute += "With http\r";
	vbstotosute += '.Open "POST", url, False\r';
	vbstotosute += '.SetRequestHeader "Content-Type", "application/json"\r';
	vbstotosute += '.SetRequestHeader "User-Agent" , "Yahoo AppID: dj00aiZpPVFwejVIbkt4RFJGVSZzPWNvbnN1bWVyc2VjcmV0Jng9NjE-"\r';
	vbstotosute += ".Send data\r";
	vbstotosute += "End With\r";
	vbstotosute += "s = http.ResponseText\r";
	vbstotosute += 'Set objInDesign = CreateObject("InDesign.Application")\r';
	vbstotosute += 'objInDesign.ScriptArgs.SetValue "http_data", s\r';
	app.doScript(vbstotosute, ScriptLanguage.VISUAL_BASIC, undefined, UndoModes.FAST_ENTIRE_SCRIPT);
	result = app.scriptArgs.getValue("http_data");
	app.scriptArgs.clear();
	return result;
}

// jsonから読み仮名を取得する関数
function getFurigana(json: any, targetArray: string[]): string[] {
	let midashiKanjiArray: string[] = targetArray;
	let yomiganaArray: string[] = [];
	for (let k = 0; k < midashiKanjiArray.length; k++) {
		let searchedCount = 0;
		for (let i = 0; i < json.result.word.length; i++) {
			let targetWord = midashiKanjiArray[k];
			let tarObj = json.result.word[i];
			// $.writeln(targetWord + " : " + tarObj.surface)
			let ruby = "";
			if (tarObj.hasOwnProperty("subword")) {
				let subword = tarObj.subword;
				for (let j = 0; j < subword.length; j++) {
					if (isWordContain(subword[j].surface, targetWord)) ruby = subword[j].furigana;
				}
			} else {
				if (isWordContain(tarObj.surface, targetWord)) ruby = tarObj.furigana;
			}
			if (ruby != "") {
				yomiganaArray.push(ruby);
				break;
			}
			searchedCount++;
		}
		// $.writeln(searchedCount + " searchedCount");
		json.result.word.splice(0, searchedCount + 1);
	}
	$.writeln(yomiganaArray);
	$.writeln(yomiganaArray.length);
	return yomiganaArray;
}
function isWordContain(string: string, word: string): boolean {
	return string.indexOf(word) != -1;
}

main();
