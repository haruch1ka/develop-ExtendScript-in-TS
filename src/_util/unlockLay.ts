const unlockLay = () => {
  const layers = app.activeDocument.layers;
  if (!layers || layers.length < 1) return;
  for (let i = 0; i < layers.length; i++) {
    const pageItems = layers[i].pageItems;
    if (!pageItems || pageItems.length < 1) continue;
    /* @ts-ignore */
    pageItems.everyItem().locked = false;
  }
};

export default unlockLay;
