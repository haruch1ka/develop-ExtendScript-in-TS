import { getTextFrame } from "./fetchItem/iterationFetch";

export const removeSpotColor = (targetColorName: Array<string>, allPageItems: Array<any>) => {
  const TextFrames: TextFrame[] | null = getTextFrame(allPageItems);
  if (!TextFrames || TextFrames.length < 1) return;
  const removedTextFrame = TextFrames.map((tf) => {
    if (removeStory(tf, targetColorName)) return tf;
  })
  .map((tf) => {
    if (tf && tf.characters.count() < 1) {
      const isNone = typeof tf.strokeColor === "object" && tf.strokeColor.name === "None";
      const isTarget = typeof tf.strokeColor === "object" && targetColorName.includes(tf.strokeColor.name);
      if (isNone || isTarget) tf.remove();
    }
  });
};

const removeStory = (textFrame: any, targetColorName: string[]): boolean => {
  const characters = textFrame.characters;
  if (!characters) return false;
  for (let i = 0; i < characters.length; i++) {
    if (targetColorName.includes(characters[i].fillColor.name)) {
      characters[0].parentStory.remove();
      return true;
    }
  }
  return false;
};
