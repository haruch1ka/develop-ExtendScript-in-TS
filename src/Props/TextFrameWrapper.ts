export const formatText = (TextFrame: TextFrame): TextFrame => {
	const res = TextFrame;
	const everyCharacter = res.characters.everyItem();
	/*@ts-ignore*/
	everyCharacter.remove();
	return res;
};
