export var formatText = function (TextFrame) {
    var res = TextFrame;
    var everyCharacter = res.characters.everyItem();
    /*@ts-ignore*/
    everyCharacter.remove();
    return res;
};
