// スクリプトを実行する前に、ドキュメントを開いてください
var doc = app.activeDocument;

// オブジェクトスタイル名
var targetStyleName = "アンカー解答";

// レイヤー名
var targetLayerName = "解答";

// オブジェクトスタイル「アンカー解答」が当たっているオブジェクトをアクティブなページから取得
//集めたすべてのアイテムを取得し変数に格納

var activePage = app.activeWindow.activePage;
$.writeln(activePage.name);

var AllObjectItem = app.activeWindow.activePage.pageItems.everyItem().getElements();
//コンソールに出力
$.writeln(AllObjectItem);

//フィルターメソッドを使用せずに、オブジェクトスタイル「アンカー解答」が当たっているオブジェクトを検索
//for文でオブジェクトを取得し、オブジェクトスタイルが「アンカー解答」の場合に配列に格納
var objectsWithTargetStyle = [];
for (var i = 0; i < AllObjectItem.length; i++) {
	if (AllObjectItem[i].appliedObjectStyle.name === targetStyleName) {
		objectsWithTargetStyle.push(AllObjectItem[i]);
		$.writeln(AllObjectItem[i].contents);
	}
}

// var objectsWithTargetStyle = AllObjectItem.
// 	.filter(function (item) {
// 		return item.appliedObjectStyle.name === targetStyleName;
// 	});

// レイヤー「解答」を作成（存在しない場合）
var targetLayer = doc.layers.item(targetLayerName);
if (!targetLayer.isValid) {
	targetLayer = doc.layers.add({ name: targetLayerName });
	$.writeln("レイヤー「解答」を作成しました");
}

// オブジェクトをレイヤー「解答」に移動
for (var i = 0; i < objectsWithTargetStyle.length; i++) {
	$.writeln(objectsWithTargetStyle[i].contents);
	$.writeln(targetLayer.name);
	objectsWithTargetStyle[i].move(targetLayer);
}

// 完了メッセージ
alert(
	"オブジェクトスタイル「" + targetStyleName + "」が当たっているオブジェクトをレイヤー「" + targetLayerName + "」に移動しました。"
);
