//ターゲットをセッションに変更する。
//シャープを利用するとtypescriptによってコンパイル時に弾かれる。
//ignoreするためにアットマークを利用しようとすると、スクリプト自体が動作しない。
//@targetengine "session"

main();

function main() {
	app.addEventListener("afterOpen", folder_level_check, false); //イベントリスナー　ファイルが開かれたあとに実行される。
}
function folder_level_check(myEvent: Event) {
	if (myEvent.parent.constructor.name == "LayoutWindow") {
		//アクティブなドキュメントを取得する。
		let doc = app.activeDocument;
		//パスをstringに変換し、デコードする。
		let decodedPath = File.decode(doc.filePath.toString());
		$.writeln(decodedPath);
		//正規表現でファイルパスに192が含まれているかチェックする。
		let reg = new RegExp("192");
		$.writeln(reg.test(decodedPath));
		if (reg.test(decodedPath as string)) {
			//パスに192が含まれている場合はアラートを表示する。
			alert("このファイルはローカルにありません\n\n" + decodedPath);
		} else {
			//チェック用
			// alert("このファイルはローカルにあります\n\n" + decodedPath);
		}
	}
}
