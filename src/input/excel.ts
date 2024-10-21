export class excel {
	excelFilePath: string;
	splitChar: string;
	sheetNumber: string;
	constructor(excelFilePath: any, splitChar: string, sheetNumber: string) {
		this.excelFilePath = excelFilePath;
		this.splitChar = splitChar;
		this.sheetNumber = sheetNumber;
	}
	GetDataFromExcelPC() {
		try {
			if (typeof this.splitChar === "undefined") this.splitChar = ";";
			if (typeof this.sheetNumber === "undefined") this.sheetNumber = "1";
			let appVersionNum = Number(String(app.version).split(".")[0]),
				data: any = [];
			let vbs = "Public s, excelFilePath\r";
			vbs += "Function ReadFromExcel()\r";
			vbs += "On Error Resume Next\r";
			vbs += "Err.Clear\r";
			vbs += 'Set objExcel = CreateObject("Excel.Application")\r';
			vbs += 'Set objBook = objExcel.Workbooks.Open("' + this.excelFilePath + '")\r';
			vbs += "Set objSheet =  objExcel.ActiveWorkbook.WorkSheets(" + this.sheetNumber + ")\r";
			vbs += 's = s & "[" & objSheet.Name & "]"\r';
			vbs += "objExcel.Visible = True\r";
			vbs += "matrix = objSheet.UsedRange\r";
			vbs += "maxDim0 = UBound(matrix, 1)\r";
			vbs += "maxDim1 = UBound(matrix, 2)\r";
			vbs += "For i = 1 To maxDim0\r";
			vbs += "For j = 1 To 3\r";
			vbs += "If j = maxDim1 Then\r";
			vbs += "s = s & matrix(i, j)\r";
			vbs += "Else\r";
			vbs += 's = s & matrix(i, j) & "' + this.splitChar + '"\r';
			vbs += "End If\r";
			vbs += "Next\r";
			vbs += "s = s & vbCr\r";
			vbs += "Next\r";
			vbs += "objBook.Close\r";
			vbs += "Set objSheet = Nothing\r";
			vbs += "Set objBook = Nothing\r";
			vbs += "Set objExcel = Nothing\r";
			vbs += "SetArgValue()\r";
			vbs += "On Error Goto 0\r";
			vbs += "End Function\r";
			vbs += "Function SetArgValue()\r";
			vbs += 'Set objInDesign = CreateObject("InDesign.Application")\r';
			vbs += 'objInDesign.ScriptArgs.SetValue "excel_data", s\r';
			vbs += "End Function\r";
			vbs += "ReadFromExcel()\r";

			if (appVersionNum > 5) {
				// CS4 and above
				app.doScript(vbs, ScriptLanguage.VISUAL_BASIC, undefined, UndoModes.FAST_ENTIRE_SCRIPT);
			} else {
				// CS3 and below
				app.doScript(vbs, ScriptLanguage.VISUAL_BASIC);
			}

			let str = app.scriptArgs.getValue("excel_data");
			app.scriptArgs.clear();

			let tempArrLine,
				line,
				match,
				name,
				tempArrData = str.split("\r");

			for (let i = 0; i < tempArrData.length; i++) {
				line = tempArrData[i];
				if (line == "") continue;

				match = line.match(/^\[.+\]/);

				if (match != null) {
					name = match[0].replace(/\[|\]/g, "");
					line = line.replace(/^\[.+\]/, "");
				}

				tempArrLine = line.split(this.splitChar);
				data.name = name;
				data.push(tempArrLine);
			}
			return data;
		} catch (err: any) {
			$.writeln(err.message + ", line: " + err.line);
		}
	}
}

export default excel;
