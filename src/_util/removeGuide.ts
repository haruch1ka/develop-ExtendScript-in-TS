export const removeGuide = () => {
  const guides = [] as any[];
  const doc = app.activeDocument;
  for (let i = 0; i < doc.guides.length; i++) {
    const item = doc.guides[i];
    item.remove();
  }
};
