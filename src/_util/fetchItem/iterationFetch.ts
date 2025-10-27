import fetchItemId from "./../fetchItem/fetchItemId";
const getUniqueItems = (items: any[]): any[] => {
  const itemIds = [] as any[];
  const uniqueItems = items.filter((item) => {
    const id = fetchItemId(item);
    if (itemIds.includes(id)) {
      return false;
    }
    itemIds.push(id);
    return true;
  });
  return uniqueItems;
};

export const getGraphicItem = (items: any[]): any[] | null => {
  const res = [] as any[];
  const targetTypes = ["Polygon", "GraphicLine", "Rectangle", "Oval"];
  const iteration = (items: any[]) => {
    for (const item of items) {
      if (targetTypes.includes(item.constructor.name)) {
        res.push(item);
      } else if (item.constructor.name === "Group" && item.allPageItems) {
        iteration(item.pageItems);
      }
    }
  };
  iteration(items);
  return res.length > 0 ? res : null;
};

export const getTextFrame = (items: any[]): TextFrame[] | null => {
  const res = [] as any[];
  const iteration = (items: any[]) => {
    for (const item of items) {
      if (item.constructor.name === "TextFrame") {
        res.push(item);
      } else if (item.constructor.name === "Group") {
        iteration(item.pageItems);
      }
    }
  };
  iteration(items);
  //重複するIDを除去
  const uniqueRes = getUniqueItems(res);
  return uniqueRes.length > 0 ? uniqueRes : null;
};
