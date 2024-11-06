/*es3準拠のためのポリフィル*/
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
    /*@ts-ignore*/
    Array.prototype.reduce = function (callback, initialValue) {
        if (typeof callback !== "function") {
            throw new Error("Callback must be a function");
        }
        var array = this;
        var length = array.length;
        var accumulator = initialValue !== undefined ? initialValue : array[0];
        for (var i = initialValue !== undefined ? 0 : 1; i < length; i++) {
            if (i in array) {
                accumulator = callback.call(undefined, accumulator, array[i], i, array);
            }
        }
        return accumulator;
    };
};
export default polyfill;
