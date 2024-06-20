//ダイアログ表示のおまじない
app.scriptPreferences.userInteractionLevel=1699311169;

//例文漢字のみの処理

var Input = /** @class */ (function () {
	function Input(myinput) {
		var input = myinput;
		input = input.replace(new RegExp(/^[\r\n]+/gm), "");
		var regex = new RegExp(/[\r\n]+/);
		var inputArr = input.split(regex); //入力を改行文字で分割
		this.inputDataArray = inputArr;
	}
	return Input;
})();
function forloop(times, func) {
    for (var i = 0; i < times; i++) {
        func(i);
    }
}
function replaceString(string) {
    var resString = "";
		//入力された文字列を改行で分割
    var input = new Input(string);
    var resArr = [];
		var buffer = "-1";
		//連続する文字列を削除
    forloop(input.inputDataArray.length, function (j) {
			var string = String(input.inputDataArray[j]);
			//bufferに前回の文字列を格納
			//bufferとstringが同じ場合は改行を追加、異なる場合は文字列を追加
				if(buffer == string){
					resString += "\r" ;
				}else if(buffer != string){
					resString += string + "\r";
					buffer = string;
				}
    });
		$.writeln(resString)
		//最後の改行を削除
    return resString.slice(0, -1);
}

main();

//選択オブジェクトによって処理を変える
function main(){
	var myObject;
	var myCheckSelection = false;
	if(app.documents.length > 0){
		if(app.selection.length > 0){
			switch(app.selection[0].constructor.name){
				case "InsertionPoint":
				case "Character":
				case "Word":
				case "TextStyleRange":
				case "Line":
				case "Paragraph":
				case "TextColumn":
				case "Text":
					app.scriptPreferences.userInteractionLevel = 1699311169
                            
						myObject = app.selection[0].parentStory;
						myCheckSelection = false;
            var replaced = replaceString(myObject.contents);
						myObject.contents = replaced;
					break;
				default:
			}
		}
		// alert("終了しました");
	}
}
function myDisplayDialog(){
	var myObject;
	var myDialog = app.dialogs.add({name:"検索置換範囲指定"});
	with(myDialog.dialogColumns.add()){
		with(dialogRows.add()){
			with(dialogColumns.add()){
				staticTexts.add({staticLabel:"検索範囲:"});
			}
			var myRangeButtons = radiobuttonGroups.add();
			with(myRangeButtons){
				radiobuttonControls.add({staticLabel:"選択範囲", checkedState:true});
				radiobuttonControls.add({staticLabel:"ストーリー"});
				radiobuttonControls.add({staticLabel:"ドキュメント"});
			}			
		}
	}
	var myResult = myDialog.show();
	if(myResult == true){
		switch(myRangeButtons.selectedButton){
			case 0:
				myObject = app.selection[0];
				myCheckSelection = true;
				break;
			case 1:
				myObject = app.selection[0].parentStory;
				myCheckSelection = false;
				break;
			case 2:
				myObject = app.documents.item(0);
				myCheckSelection = false;
				break;
		}
	}
	else{
		myObject = "None";
	}
	myDialog.destroy();
	return [myObject, myCheckSelection];
}
#target "InDesign"