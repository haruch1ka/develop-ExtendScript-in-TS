/// <reference types="types-for-adobe/InDesign/2021" />

class Infomation {
  showOBjType() {
    selObj = app.activeDocument.selection;
    for (i = 0; i < selObj.length; i++) {
      dType = selObj[i].constructor.name;
      alert(dType);
    }
  }
}

const infomation = new Infomation();
infomation.showOBjType();
