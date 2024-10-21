var myFileSetting = /** @class */ (function () {
    //constructor
    function myFileSetting(my_confirmation, my_config_filename, config) {
        this.my_save_folder_path = []; //PDF保存フォルダ（あとで設定）
        this.my_config_filename = ""; //設定ファイル名
        this.my_separator = ""; //パスの区切り文字
        this.my_activescript_path = ""; //このスクリプトのパス
        this.my_config_path = ""; //設定ファイルのフルパス
        this.f_modified = false; //ファイルを書き込んだかどうかのフラグ（余計な読み書き回数を減らすために）
        this.my_confirmation = my_confirmation;
        this.my_config_filename = my_config_filename;
        this.my_separator = this.get_separator();
        this.my_activescript_path = this.get_my_script_path();
        this.my_activescript_folder = File(this.my_activescript_path).parent;
        this.my_config_path = this.my_activescript_folder + this.my_separator + this.my_config_filename;
        this.actDocFolder = Folder(String(app.activeDocument.filePath));
        this.config = config;
        //設定ファイルがなかったら
        if (File(this.my_config_path).exists === false) {
            this.f_modified = this.write_setting(this.my_config_path); //設定して書き込み
        }
        //設定ファイルの読み出し
        var my_data_list_string = this.read_file(this.my_config_path);
        var my_data_list = my_data_list_string.split(/[\r\n]+/);
        for (var i = 0; i < my_data_list.length; i++) {
            this.my_save_folder_path.push(my_data_list[i]);
        }
    }
    //カレントスクリプトのフルパスを得る
    myFileSetting.prototype.get_my_script_path = function () {
        try {
            return String(app.activeScript);
        }
        catch (e) {
            return String(File(e.fileName)); //ESTKから実行した時も正しくパスを返す
        }
    };
    //ファイルの内容を読み込んで返す
    myFileSetting.prototype.read_file = function (my_read_file_path) {
        var my_file_obj = new File(my_read_file_path);
        if (!my_file_obj.exists) {
            throw new Error("ファイルがありません\n" + my_read_file_path);
        }
        var tmp_str = "";
        if (my_file_obj.open("r")) {
            tmp_str = my_file_obj.read();
            my_file_obj.close();
        }
        else {
            throw new Error("ファイルが開けません\n" + my_read_file_path);
        }
        tmp_str = tmp_str.replace(/[\r\n]+$/, ""); //最後の行末の改行を削除
        return tmp_str;
    };
    //データをファイルに書き込む 。書き込んだファイルオブジェクトを返す
    myFileSetting.prototype.write_file = function (my_write_file_path, my_data) {
        var my_file_obj = new File(my_write_file_path);
        my_file_obj.encoding = "UTF-8"; //★この行がないとShift-JISで書き出される
        if (my_file_obj.open("w")) {
            my_file_obj.write(my_data);
            my_file_obj.close();
            return my_file_obj;
        }
        else {
            throw new Error("ファイルが開けません\n" + my_write_file_path);
        }
    };
    //初期設定＆設定ファイル書き込み
    myFileSetting.prototype.write_setting = function (my_write_file_path) {
        var _this = this;
        var tmp_data = "\r";
        /*@ts-ignore*/
        this.config.map(function (v) {
            if (v.type === "folder") {
                tmp_data += _this.chooseFolder(v.disc) + "\r\n";
            }
            else {
                tmp_data += _this.chooseFile(v.disc) + "\r\n";
            }
        });
        this.write_file(my_write_file_path, tmp_data);
        return true; //書き込み済みであることのフラグ
    };
    //OSのファイルセパレータを得る
    myFileSetting.prototype.get_separator = function () {
        if (Folder.fs === "Macintosh") {
            return "/";
        }
        else {
            return "\\";
        }
    };
    //ファイル・フォルダ選択ダイアログ。パス文字列を返す。
    myFileSetting.prototype.chooseFolder = function (my_prompt) {
        var active_folder_path = decodeURI(String(app.activeDocument.filePath));
        var my_pathx = Folder().selectDlg(my_prompt);
        var decoded = decodeURI(String(my_pathx));
        return decoded;
    };
    myFileSetting.prototype.chooseFile = function (my_prompt) {
        var active_folder_path = decodeURI(String(app.activeDocument.filePath));
        var my_pathx = File().openDlg(my_prompt);
        var decoded = decodeURI(String(my_pathx));
        return decoded;
    };
    return myFileSetting;
}());
export { myFileSetting };
export default myFileSetting;
