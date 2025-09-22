export const removeSpotColorPolygon = (targetColorName: Array<string>, allPageItems: Array<any>) => {
  const items = allPageItems;
  const removedTextFrame = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    $.writeln(`Item ${i}: ${item.constructor.name}`);
    if (item.constructor.name === "Group") {
      const GroupItems = item.allPageItems;
      for (let k = 0; k < GroupItems.length; k++) {
        $.writeln(`-- ${GroupItems[k].constructor.name}`);
      }
      // const isRemoved = remove(item, targetColorName);
      // if (isRemoved) removedTextFrame.push(item);
      $.writeln(i);
    }
  }
  // removedTextFrame.map((item) => {
  // 	const isSpotColorOrNone = [...targetColorName, "None"].includes(item.strokeColor.name);
  // 	if (isSpotColorOrNone) item.remove();
  // });
};

const remove = (pageItem: any, targetColorName: string[]): boolean => {
  const characters = pageItem.characters;
  if (!characters) return false;
  for (let j = 0; j < characters.length; j++) {
    if (targetColorName.includes(characters[j].fillColor.name)) {
      characters[0].parentStory.remove();
      return true;
    }
  }
  return false;
};
