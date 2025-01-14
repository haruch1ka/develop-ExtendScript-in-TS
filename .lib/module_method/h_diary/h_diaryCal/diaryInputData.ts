import Excel from "./../_fetch/Excel";
import MyFileSetting from "./../_fetch/MyFileSetting";

class diaryInputData {
	data = [];
	constructor() {
		const config = [{ type: "file", disc: "excelファイルを選んでください" }];
		const setting = new MyFileSetting(false, "diary_setting.txt", config);
		const tab = 1;
		const excelfile = new File(setting.my_save_folder_path[1]);
		const excel_instance = new Excel(excelfile.fsName, ";", String(tab), 9);
		this.data = excel_instance.GetDataFromExcelPC();
		//dataArrayを 0~8ごとにひとかたまりとして、それを配列に格納する。
	}
}
export default diaryInputData;
