class myFileSetting {
	//field
	my_confirmation: boolean; //処理前に確認ダイアログを表示するかどうか
	my_save_folder_path: string = ""; //PDF保存フォルダ（あとで設定）
	my_save_folder_path2: string = ""; //PDF保存フォルダ（あとで設定）
	my_digitnum: number = 4; //ノンブルが数値だったら、桁を揃える。2=>002, 45=>045, 123=>123
	my_config_filename: string = ""; //設定ファイル名
	my_separator: string = ""; //パスの区切り文字
	my_activescript_path: string = ""; //このスクリプトのパス
	my_activescript_folder: Folder; //このスクリプトのコンテナフォルダ
	my_config_path: string = ""; //設定ファイルのフルパス
	actDocFolder: Folder; // アクティブなドキュメントの入っているフォルダ
	f_modified: boolean = false; //ファイルを書き込んだかどうかのフラグ（余計な読み書き回数を減らすために）

	//constructor
	constructor(my_confirmation: boolean, my_config_filename: string) {
		this.my_confirmation = my_confirmation;
		this.my_config_filename = my_config_filename;
		this.my_separator = this.get_separator();
		this.my_activescript_path = this.get_my_script_path();
		this.my_activescript_folder = File(this.my_activescript_path).parent;
		this.my_config_path = this.my_activescript_folder + this.my_separator + this.my_config_filename;
		this.actDocFolder = Folder(String(app.activeDocument.filePath));

		//設定ファイルがなかったら
		if (File(this.my_config_path).exists === false) {
			this.f_modified = this.write_setting(this.my_config_path); //設定して書き込み
		}

		//設定ファイルの読み出し
		let my_data_list_string: string = this.read_file(this.my_config_path);
		let my_data_list: string[] = my_data_list_string.split(/[\r\n]+/);
		this.my_save_folder_path = my_data_list[1];
		this.my_save_folder_path2 = my_data_list[2];
	}
	//カレントスクリプトのフルパスを得る
	get_my_script_path(): string {
		try {
			return String(app.activeScript);
		} catch (e: any) {
			return String(File(e.fileName)); //ESTKから実行した時も正しくパスを返す
		}
	}

	//ファイルの内容を読み込んで返す
	read_file(my_read_file_path: string): string {
		let my_file_obj: File = new File(my_read_file_path);
		if (!my_file_obj.exists) {
			throw new Error("ファイルがありません\n" + my_read_file_path);
		}
		let tmp_str: string = "";
		if (my_file_obj.open("r")) {
			tmp_str = my_file_obj.read();
			my_file_obj.close();
		} else {
			throw new Error("ファイルが開けません\n" + my_read_file_path);
		}
		tmp_str = tmp_str.replace(/[\r\n]+$/, ""); //最後の行末の改行を削除
		return tmp_str;
	}
	//データをファイルに書き込む 。書き込んだファイルオブジェクトを返す
	write_file(my_write_file_path: string, my_data: string): File {
		let my_file_obj: File = new File(my_write_file_path);
		my_file_obj.encoding = "UTF-8"; //★この行がないとShift-JISで書き出される
		if (my_file_obj.open("w")) {
			my_file_obj.write(my_data);
			my_file_obj.close();
			return my_file_obj;
		} else {
			throw new Error("ファイルが開けません\n" + my_write_file_path);
		}
	}

	//初期設定＆設定ファイル書き込み
	write_setting(my_write_file_path: string): boolean {
		let tmp_data: string = "\r";
		let myPath: string = this.chooseF("Partsが保存してあるフォルダを選んでください");
		let myPath2: string = this.chooseF("excelファイルが保存してあるフォルダを選んでください");
		//alert ("保存先\n"+myPath);
		tmp_data += myPath + "\r\n";
		tmp_data += myPath2 + "\r\n";
		this.write_file(my_write_file_path, tmp_data);
		return true; //書き込み済みであることのフラグ
	}

	//OSのファイルセパレータを得る
	get_separator(): string {
		if (Folder.fs === "Macintosh") {
			return "/";
		} else {
			return "\\";
		}
	}

	//ファイル・フォルダ選択ダイアログ。パス文字列を返す。
	chooseF(my_prompt: string): string {
		const active_folder_path: string = decodeURI(String(app.activeDocument.filePath));
		let my_pathx: string = "";
		my_pathx = my_pathx + Folder(active_folder_path).selectDlg(my_prompt);
		return decodeURI(my_pathx);
	}
}

let setting = new myFileSetting(false, "my_setting.txt");
$.writeln(setting.my_save_folder_path);
$.writeln(setting.my_save_folder_path2);
