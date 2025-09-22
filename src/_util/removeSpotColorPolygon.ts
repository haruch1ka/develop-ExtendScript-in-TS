export const removeSpotColorPolygon = (targetColorName: Array<string>, allPageItems: Array<any>) => {
  const removePageItems = [] as any[];
  const removeTextFrame = [] as any[];
  const removeTargets = (items: any[]) => {
    for (const item of items) {
      if (item.constructor.name === "Polygon" || item.constructor.name === "GraphicLine" || item.constructor.name === "Rectangle") {
        if (targetColorName.includes(item.strokeColor.name) || targetColorName.includes(item.fillColor.name)) {
          removePageItems.push(item);
        }
      } else if (item.constructor.name === "Group" && item.allPageItems) {
        removeTargets(item.pageItems);
      }
    }
  };
  removeTargets(allPageItems);

  if (removePageItems.length > 0) {
    for (const item of removePageItems) {
      item.remove();
    }
  }
};
