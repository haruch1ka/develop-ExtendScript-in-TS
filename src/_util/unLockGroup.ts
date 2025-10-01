export const unLockGroup = () => {
  var doc = app.activeDocument;
  var allPageItems = doc.pages[0].pageItems;
  for (var i = 0; i < allPageItems.length; i++) {
    const item = allPageItems[i].getElements()[0];
    if (item.constructor.name == "Group") {
      allPageItems[i].select(SelectionOptions.ADD_TO);
    }
  }
  const selection = app.activeDocument.selection as any[];
  if (selection.length < 1) return;
  $.writeln("selection.length:" + selection.length);

  /*@ts-ignore */
  const selGroup = doc.groups.add(doc.selection as any);
  IrekoGroupKaijo(selGroup);
  function IrekoGroupKaijo(GObj: any) {
    while (GObj.groups.length > 0) {
      //グループを破壊するのでダルマ落とし的に次のグループがgroups[0]に
      $.writeln("ungroup");
      GObj.groups[0].ungroup();
    }
  }
};
