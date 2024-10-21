import excel from "./input/excel";
import myFileSetting from "./input/myFileSetting";
import polyfill from "./polyfill/polyfill";

polyfill();
const config = [{ type: "file", disc: "excelファイルを選んでください" }];
const setting = new myFileSetting(false, "dialog_honshi.txt", config);
const tab = 1;

$.writeln(setting.my_save_folder_path[1]);
const excelfile = new File(setting.my_save_folder_path[1]);
$.writeln(excelfile.fsName);
let excel_instance = new excel(excelfile.fsName, ";", String(tab));
$.writeln(excel_instance.GetDataFromExcelPC());
// let excel_data = excel_instance.GetDataFromExcelPC();
