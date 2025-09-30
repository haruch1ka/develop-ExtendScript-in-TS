import { getGraphicItem } from "../_util/fetchItem/iterationFetch";
export const removeSpotColorPolygon = (targetColorName: Array<string>, allPageItems: Array<any>) => {
  const removePageItems = getGraphicItem(allPageItems).filter(
    (item: any) => targetColorName.includes(item.strokeColor.name) || targetColorName.includes(item.fillColor.name),
  );

  if (removePageItems.length > 0) {
    for (const item of removePageItems) {
      item.remove();
    }
  }
};
