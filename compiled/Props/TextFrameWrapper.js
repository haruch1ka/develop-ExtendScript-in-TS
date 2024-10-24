export var formatText = function (TextFrame) {
    var res = TextFrame;
    var everyCharacter = res.characters.everyItem();
    /*@ts-ignore*/
    everyCharacter.remove();
    return res;
};
export var changeCharacterStyle = function (TextFrame, characterStyle) {
    var res = TextFrame;
    var everyCharacter = res.characters.everyItem();
    /*@ts-ignore*/
    everyCharacter.appliedCharacterStyle = characterStyle;
    return res;
};
export var changeParagraphStyle = function (TextFrame, paragraphStyle) {
    var res = TextFrame;
    var everyCharacter = res.paragraphs.everyItem();
    /*@ts-ignore*/
    everyCharacter.appliedParagraphStyle = paragraphStyle;
    return res;
};
