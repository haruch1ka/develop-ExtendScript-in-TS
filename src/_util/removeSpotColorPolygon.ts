import { getGraphicItem } from "../_util/fetchItem/iterationFetch";
export const removeSpotColorPolygon = (targetColorName: Array<string>, allPageItems: Array<any>) => {
  const removePageItems = getGraphicItem(allPageItems)
    .filter((g_elm: any) => targetColorName.includes(g_elm.strokeColor.name) || targetColorName.includes(g_elm.fillColor.name))
    .map((g_elm: any) => g_elm.remove());
};
