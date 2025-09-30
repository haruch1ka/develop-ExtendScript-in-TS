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
