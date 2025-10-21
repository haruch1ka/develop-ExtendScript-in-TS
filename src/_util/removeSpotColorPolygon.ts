import { getGraphicItem, getTextFrame } from "../_util/fetchItem/iterationFetch";

export const removeSpotColorPolygon = (targetColorName: Array<string>, allPageItems: Array<any>) => {
  const removePageItems: any[] = [];
  // "Polygon","GraphicLine","Rectangle"
  const allGraphicItems = getGraphicItem(allPageItems);
  const allTextFrames = getTextFrame(allPageItems);
  if (allGraphicItems) removePageItems.push(...allGraphicItems);
  if (allTextFrames) removePageItems.push(...allTextFrames);
  if (removePageItems.length === 0) return;
  removePageItems
    .filter((g_elm: any) => targetColorName.includes(g_elm.strokeColor.name) || targetColorName.includes(g_elm.fillColor.name))
    .map((g_elm: any) => g_elm.remove());
};
