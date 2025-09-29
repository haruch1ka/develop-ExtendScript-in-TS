export type geometricBounds = readonly [number, number, number, number];
export const getGeoPraram = {
  getLT(geometricBounds: geometricBounds) {
    return [geometricBounds[1], geometricBounds[0]];
  },
  getRT(geometricBounds: geometricBounds) {
    return [geometricBounds[3], geometricBounds[0]];
  },
  getLB(geometricBounds: geometricBounds) {
    return [geometricBounds[1], geometricBounds[2]];
  },
  getRB(geometricBounds: geometricBounds) {
    return [geometricBounds[3], geometricBounds[2]];
  },
  getW(geometricBounds: geometricBounds) {
    return geometricBounds[3] - geometricBounds[1];
  },
  getH(geometricBounds: geometricBounds) {
    return geometricBounds[2] - geometricBounds[0];
  },
};
