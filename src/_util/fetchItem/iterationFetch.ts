export const getGraphicItem = (items: any[]) => {
  const res = [] as any[];
  const iteration = (items: any[]) => {
    for (const item of items) {
      if (item.constructor.name === "Polygon" || item.constructor.name === "GraphicLine" || item.constructor.name === "Rectangle") {
        res.push(item);
      } else if (item.constructor.name === "Group" && item.allPageItems) {
        iteration(item.pageItems);
      }
    }
  };
  iteration(items);
  return res;
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
  return res.length > 0 ? res : null;
};
//   if (item.constructor.name === "TextFrame") {
//     const isRemoved = remove(item, targetColorName);
//     if (isRemoved) removedTextFrame.push(item);
//   } else if (item.constructor.name === "Group") {
//     iteration(item.pageItems);
//   }
