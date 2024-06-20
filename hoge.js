let sizeW, sizeH, Correction;
sizeW = canvas.width;
sizeH = canvas.height;
Correction = sizeW / 1280;
console.log("ステージサイズ", sizeW, sizeH);

//ステージサイズが変更されたら
window.onresize = canvas_load;
//サイズの表示
function canvas_load() {
	sizeW = canvas.width;
	sizeH = canvas.height;
	Correction = sizeW / 1280;
	console.log("ステージサイズ変更", sizeW, sizeH);
}

this.xCorrection = function () {
	return Correction;
};

//画面更新タイミング
createjs.Ticker.timingMode = createjs.Ticker.RAF; //最も滑らかに表現できるが、60FPS固定
//フレームレートを変えたいなら、↑を消して↓で指定する。
//createjs.Ticker.setFPS(60);

// タッチ操作をサポートしているブラウザーならば
if (createjs.Touch.isSupported() == true) {
	// タッチ操作を有効にします。
	createjs.Touch.enable(stage);
}

// 次のフレームに移動
this.susumu_i.addEventListener("click", x_nextFrame.bind(this));
function x_nextFrame() {
	// 現在のフレームのフレーム番号を取得
	let frameNumber_N = this.currentFrame;
	this.gotoAndStop(frameNumber_N + 1);

	console.log(frameNumber_N + 1);
}

// 前のフレームに移動
this.modoru_i.addEventListener("click", x_prevFrame.bind(this));
function x_prevFrame() {
	// 現在のフレームのフレーム番号を取得
	let frameNumber_R = this.currentFrame;
	this.gotoAndStop(frameNumber_R - 1);

	console.log(frameNumber_R - 1);
}

//クリックイベント
let myfu_0402_01 = this.i0402.fu_01_i;
let myfu_0402_02 = this.i0402.fu_02_i;
let myfu_0405_01 = this.i0405.fu_01_i;
let myfu_0408_01 = this.i0408.fu_01_i;
let myfu_0408_02 = this.i0408.fu_02_i;
let myfu_0408_03 = this.i0408.fu_03_i;
let myfu_0408_04 = this.i0408.fu_04_i;
let myfu_0408_05 = this.i0408.fu_05_i;
let myfu_0501_01 = this.i0501.fu_01_i;
let myfu_0501_02 = this.i0501.fu_02_i;
let myfu_0501_03 = this.i0501.fu_03_i;

let myfu_0402_01_kai = this.i0402.fu_01_kai_i;
let myfu_0402_02_kai = this.i0402.fu_02_kai_i;
let myfu_0405_01_kai = this.i0405.fu_01_kai_i;
let myfu_0408_01_kai = this.i0408.fu_01_kai_i;
let myfu_0408_02_kai = this.i0408.fu_02_kai_i;
let myfu_0408_03_kai = this.i0408.fu_03_kai_i;
let myfu_0408_04_kai = this.i0408.fu_04_kai_i;
let myfu_0408_05_kai = this.i0408.fu_05_kai_i;
let myfu_0501_01_kai = this.i0501.fu_01_kai_i;
let myfu_0501_02_kai = this.i0501.fu_02_kai_i;
let myfu_0501_03_kai = this.i0501.fu_03_kai_i;

let myfu_List = [
	myfu_0402_01,
	myfu_0402_02,
	myfu_0405_01,
	myfu_0408_01,
	myfu_0408_02,
	myfu_0408_03,
	myfu_0408_04,
	myfu_0408_05,
	myfu_0501_01,
	myfu_0501_02,
	myfu_0501_03,
];
let myfu_kai_List = [
	myfu_0402_01_kai,
	myfu_0402_02_kai,
	myfu_0405_01_kai,
	myfu_0408_01_kai,
	myfu_0408_02_kai,
	myfu_0408_03_kai,
	myfu_0408_04_kai,
	myfu_0408_05_kai,
	myfu_0501_01_kai,
	myfu_0501_02_kai,
	myfu_0501_03_kai,
];

console.log("配列入った？", myfu_List, myfu_kai_List);

//吹き出しクリックリスナー
for (let i = 0; i < myfu_List.length; i++) {
	myfu_List[i].addEventListener("click", onClick);
	myfu_kai_List[i].addEventListener("click", offClick);
}
//console.log('リスナー消えた？2',myfu_0402_02.hasEventListener ('click'));

//クリック動作関数
function onClick(event) {
	let myTarget = event.currentTarget;
	for (let i = 0; i < myfu_List.length; i++) {
		if (myfu_List[i] == myTarget) {
			myfu_kai_List[i].visible = true;
			console.log("解説出た？", myTarget);
		}
	}
}

const bingoCard = Array.from({ length: n }, () => Array(n).fill(false));

console.log("bingoCard", bingoCard);

//クリック動作関数
function offClick(event) {
	let myTarget = event.currentTarget;
	for (let i = 0; i < myfu_List.length; i++) {
		if (myfu_kai_List[i] == myTarget) {
			myfu_kai_List[i].visible = false;
			console.log("解説消えた？", myTarget);
		}
	}
}
