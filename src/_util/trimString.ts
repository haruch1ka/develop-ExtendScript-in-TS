export const trimContents = (contents: any): string[] => {
  const regex = new RegExp(/[\r\n]+/);
  const lines = contents.split(regex);
  return lines;
};
