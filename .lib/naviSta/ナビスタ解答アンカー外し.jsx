/*　++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
ANオフセット　ナビスタ英語　解答用アンカー解除用script
オブジェクトスタイル「アンカー解答」の設定されているアンカーを解除する。
その後、解除したアンカーを「解答」レイヤーに移動する。
2024.05.20 ver.1
大寶製版　平川
System requirements : InDesign CC2022
//　++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
var doc = app.activeDocument;
var sel = doc.selection[0];
var ancs = [];

for (var i = 0; i < sel.pageItems.length; i++) {
	if (sel.pageItems[i].anchoredObjectSettings.anchoredPosition == AnchorPosition.anchored) {
		if (sel.pageItems[i].appliedObjectStyle.name == "アンカー解答") {
			ancs.push(sel.pageItems[i]);
		}
	}
}

for (var j = 0; j < ancs.length; j++) {
	ancs[j].anchoredObjectSettings.releaseAnchoredObject();
}

alert("オブジェクトスタイル「アンカー解答」が設定されているアンカーが解除されました。");
