var polyfill = function () {
    /*@ts-ignore*/
    Array.prototype.map = function (callback, thisArg) {
        if (typeof this.length != "number")
            return;
        if (typeof callback != "function")
            return;
        var newArr = [];
        if (typeof this == "object") {
            for (var i = 0; i < this.length; i++) {
                if (i in this) {
                    /*@ts-ignore*/
                    newArr[i] = callback.call(thisArg || this, this[i], i, this);
                }
                else {
                    return;
                }
            }
        }
        return newArr;
    };
    /*@ts-ignore*/
    Array.prototype.indexOf = function (obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
};
export default polyfill;
