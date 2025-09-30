

if (folderObj != null) {
  fileList = new Array();
  fileList = folderObj.getFiles("*.ai");
  for (f = 0; f <= fileList.length - 1; f++) {
    var fileObj = new File(fileList[f]);
    open(fileObj);
    flag = fileObj.open();
    if (flag == true) {
      mydocument = app.activeDocument; //　レイヤーをカウントする。
      layercount = mydocument.layers.length;
      var visibleflag = []; //　レイヤーの表示状態を記憶し、レイヤーの表示、ロック解除を行う。
      for (i = 0; i < layercount; i++) {
        mylayer = mydocument.layers[i];
        visibleflag[i] = mylayer.visible;
        mylayer.visible = true;
        mylayer.locked = false;
      } //　テキストフレームをカウントする。
      for (n = 0; n < mydocument.pageItems.length; n++) {
        mydocument.pageItems[n].locked = false;
      } //　レイヤーの表示状態を元に戻し、ロックする。
      for (m = 0; m < layercount; m++) {
        mylayer = mydocument.layers[m];
        if (visibleflag[m] != true) {
          mylayer.visible = false;
        }
      }
    }
    options = new IllustratorSaveOptions();
    options.embedICCProfile = true;
    savefile = new File(folder.fsName + "/" + fileObj.name);
    mydocument.saveAs(savefile, options);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
}

alert("処理が完了しました。スクリプトを終了します。");
