import excel from "./input/excel";
import myFileSetting from "./input/myFileSetting";
var diaryInputData = /** @class */ (function () {
    function diaryInputData() {
        this.data = [];
        var config = [{ type: "file", disc: "excelファイルを選んでください" }];
        var setting = new myFileSetting(false, "diary_honshi_setting.txt", config);
        var tab = 1;
        var excelfile = new File(setting.my_save_folder_path[1]);
        var excel_instance = new excel(excelfile.fsName, ";", String(tab), 9);
        this.data = excel_instance.GetDataFromExcelPC();
        //dataArrayを 0~8ごとにひとかたまりとして、それを配列に格納する。
    }
    return diaryInputData;
}());
export default diaryInputData;
