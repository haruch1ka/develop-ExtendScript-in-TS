//スタイル管理のクラス
class Styles {
	doc = app.activeDocument;
	styles: any[];
	constructor(styles: any) {
		this.styles = styles;
	}
	getStyle(name: string) {
		for (let i = 0; i < this.styles.length; i++) {
			if (this.styles[i].name === name) return this.styles[i];
		}
	}
	disp() {
		for (let i = 0; i < this.styles.length; i++) {
			$.writeln(this.styles[i].name);
		}
	}
}

export default Styles;
