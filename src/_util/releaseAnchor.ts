const releaseAnchor = (myObject: any) => {
  let findGrep: FindGrepPreference;
  let findAnchor: Character[] = [];
  const res = [];
  try {
    if (app.findGrepPreferences instanceof FindGrepPreference) {
      findGrep = app.findGrepPreferences;
      findGrep.findWhat = NothingEnum.NOTHING;
      findGrep.findWhat = "~a";
    }

    findAnchor = myObject.findGrep(false);
    if (findAnchor.length === 0) return [myObject];
    if (findAnchor.length !== myObject.pageItems.length) return [myObject];

    const myAnchoredItems = Array.from(myObject.pageItems)
      .map((item) => (item as { getElements: () => any[] }).getElements()[0])
      .filter((item) => item.anchoredObjectSettings.anchoredPosition == AnchorPosition.ANCHORED)
      .map((item) => {
        item.anchoredObjectSettings.releaseAnchoredObject();
        return item;
      });

    return [myObject, myAnchoredItems];
  } catch (e: any) {
    alert(e);
  }
};

export default releaseAnchor;
