//置き換えリスト（アンカー内の文字をアンカー解除時に変更する場合。変更しない場合は[　]内を削除）
let changeList: string[] = [
	//"問","お問合せ：",
	//"定","定員：",
];
//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function checkSelection() {
	let myObject;
	let myCheckSelection = false;
	if (app.documents.length > 0) {
		let appSel = app.selection as object[];
		if (appSel.length > 0) {
			switch (appSel[0].constructor.name) {
				case "InsertionPoint":
				case "Character":
				case "Word":
				case "TextStyleRange":
				case "Line":
				case "Paragraph":
				case "TextColumn": //選択された複数文字
				case "Text":
				case "TextFrame":
					app.scriptPreferences.userInteractionLevel = 1699311169;
					//myFindText(myObject, myFindLimit, myFindPreferences, myChangePreferences, myCheckSelection);
					myObject = myDisplayDialog(appSel);
					myCheckSelection = myObject[1];
					myObject = myObject[0];
					if (myObject != null) {
						find_and_grep(myObject, myCheckSelection);
						// find_and_replace(myObject, myCheckSelection);
						//myFindChangeByList(myObject, myCheckSelection);
					}
					break;
				default:
					alert("適切なオブジェクトを選択してください。");
				// app.scriptPreferences.userInteractionLevel = 1699311169;
				// for (let sel = 0; sel < appSel.length; sel++) {
				// 	find_and_replace(appSel[sel], false);
				// }
				//myFindChangeByList(app.documents.item(0), false);
			}
		} else {
			alert("オブジェクトが選択されていません。");
			//Nothing was selected, so simply search the document.
			// find_and_replace(app.documents.item(0), false);
			//myFindChangeByList(app.documents.item(0), false);
		}
	} else {
		alert("ドキュメントが開かれていません。");
	}
}
function myDisplayDialog(Selection: object[]): [object | null, boolean] {
	let myObject: object | null, myRangeButtons: RadiobuttonGroup, myCheckSelection: boolean;
	[myCheckSelection, myObject] = [false, null];
	let myDialog = app.dialogs.add({ name: "検索置換範囲指定" });
	// @ts-ignore //withの使用を許可　//書き直すのが非常に面倒
	with (myDialog.dialogColumns.add()) {
		// @ts-ignore
		with (dialogRows.add()) {
			// @ts-ignore
			with (dialogColumns.add()) {
				staticTexts.add({ staticLabel: "検索範囲:" });
			}
			myRangeButtons = radiobuttonGroups.add();
			// @ts-ignore
			with (myRangeButtons) {
				radiobuttonControls.add({ staticLabel: "選択範囲", checkedState: true });
				radiobuttonControls.add({ staticLabel: "ストーリー" });
				radiobuttonControls.add({ staticLabel: "ドキュメント" });
			}
		}
	}
	let myResult = myDialog.show();
	if (myResult == true && myRangeButtons != null) {
		switch (myRangeButtons.selectedButton) {
			case 0:
				myObject = Selection[0];
				myCheckSelection = true;
				break;
			case 1:
				if ("parentStory" in Selection[0]) myObject = Selection[0].parentStory as object;
				myCheckSelection = false;
				break;
			case 2:
				myObject = app.documents.item(0);
				myCheckSelection = false;
				break;
		}
	}
	myDialog.destroy();
	return [myObject, myCheckSelection];
}

function find_and_grep(myObject: any, myCheckSelection: boolean) {
	let findGrep: FindGrepPreference;
	let findAnchor: Character[] = [];
	try {
		if (app.findGrepPreferences instanceof FindGrepPreference) {
			findGrep = app.findGrepPreferences;
			findGrep.findWhat = NothingEnum.NOTHING;
			findGrep.findWhat = "~a";
		}

		$.writeln("myObject: " + myObject);
		$.writeln("myCheckSelection: " + myCheckSelection);

		findAnchor = myObject.findGrep(false);

		let yesNo = confirm(findAnchor.length + "カ所のアンカー/インラインを解除し、\r\nテキストに変換します。よろしいですか？");
		if (yesNo == false) alert("処理を中止しました。");

		//アンカー解除処理開始
		$.writeln("findAnchor.constructor.name: " + findAnchor.constructor.name);
		for (let i = 0; i < findAnchor.length; i++) {
			try {
				let anchorText: string = "";
				for (let j = 0; j < findAnchor[i].allPageItems.length; j++) {
					try {
						//アンカー内のテキストを取得;
						let myPageItem = findAnchor[i].allPageItems[j];
						let myElement = myPageItem.getElements()[0];
						if (myElement instanceof TextFrame) {
							let myTextFrame = myElement as TextFrame;
							anchorText = anchorText + myTextFrame.contents;
						}
						// 	let myTextFrame = myPageItem as TextFrame;
						// 	anchorText = anchorText + myTextFrame.contents;
					} catch (error) {}
				}
				$.writeln("anchorText: " + anchorText);
				// アンカー内にテキストが見つからなかった場合
				if (anchorText == "") {
					findAnchor[i].select();
					if (app.activeWindow instanceof LayoutWindow) app.activeWindow.zoomPercentage = app.activeWindow.zoomPercentage;
					yesNo = confirm("アンカー/インライン内に文字情報が見つかりません。\r\nアンカー/インラインを削除してよろしいですか？");
					if (yesNo == false) continue;
				}
				//置き換え処理用
				for (var j = 0; j < changeList.length; j = j + 2) {
					if (anchorText == changeList[j]) {
						anchorText = changeList[j + 1];
					}
				}
				//アンカー解除
				findAnchor[i].contents = anchorText;
			} catch (e: any) {
				findAnchor[i].select();
				if (app.activeWindow instanceof LayoutWindow) app.activeWindow.zoomPercentage = app.activeWindow.zoomPercentage;
				alert(e);
			}
		}
	} catch (e: any) {
		alert(e);
	} finally {
		alert("処理が完了しました。");
	}
}

checkSelection();
