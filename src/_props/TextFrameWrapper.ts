export const formatText = (TextFrame: TextFrame): TextFrame => {
	const res = TextFrame;
	const everyCharacter = res.characters.everyItem();
	/*@ts-ignore*/
	everyCharacter.remove();
	return res;
};

export const changeCharacterStyle = (TextFrame: TextFrame, characterStyle: CharacterStyle): TextFrame => {
	const res = TextFrame;
	const everyCharacter = res.characters.everyItem();
	/*@ts-ignore*/
	everyCharacter.appliedCharacterStyle = characterStyle;
	return res;
};

export const changeParagraphStyle = (TextFrame: TextFrame, paragraphStyle: ParagraphStyle): TextFrame => {
	const res = TextFrame;
	const everyCharacter = res.paragraphs.everyItem();
	/*@ts-ignore*/
	everyCharacter.appliedParagraphStyle = paragraphStyle;
	return res;
};
