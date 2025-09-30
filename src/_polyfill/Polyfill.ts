/*es3準拠のためのポリフィル*/
const Polyfill = () => {
  Array.prototype.map = function <U>(callback: (value: any, index: number, array: any[]) => U, thisArg?: any): U[] {
    if (typeof this.length !== "number" || typeof callback !== "function") return [];
    let newArr: U[] = [];
    for (let i = 0; i < this.length; i++) {
      if (i in this) {
        newArr[i] = callback.call(thisArg || this, this[i], i, this);
      }
    }
    return newArr;
  };
  Array.prototype.indexOf = function (obj, start) {
    for (let i = start || 0, j = this.length; i < j; i++) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
  };
  Array.prototype.reduce = function (callback, initialValue) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    const array = this;
    const length = array.length;
    let accumulator = initialValue !== undefined ? initialValue : array[0];

    for (let i = initialValue !== undefined ? 0 : 1; i < length; i++) {
      if (i in array) {
        accumulator = callback.call(Object(null), accumulator, array[i], i, array);
      }
    }
    return accumulator;
  };
  Array.prototype.includes = function (searchElement) {
    // Iterate through each element in the array
    for (let i = 0; i < this.length; i++) {
      // Check if the current element is equal to the search element
      if (this[i] === searchElement) {
        return true;
      }
    }
    return false;
  };
  Array.prototype.filter = function (callBack) {
    let output = [];
    for (let i = 0; i < this.length; i++) {
      if (callBack(this[i], i, this)) output.push(this[i]);
    }
    return output;
  };
  Array.from = (function () {
    let toStr = Object.prototype.toString;
    let isCallable = function (fn: any) {
      return typeof fn === "function" || toStr.call(fn) === "[object Function]";
    };
    let toInteger = function (value: any) {
      let number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    let maxSafeInteger = Math.pow(2, 53) - 1;
    let toLength = function (value: any) {
      let len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(this: any, arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      let C = this;

      // 2. Let items be ToObject(arrayLike).
      let items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new Error("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      let mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      let T;
      if (typeof mapFn !== "undefined") {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new Error("Array.from: when provided, the second argument must be a function");
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      let len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      let A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      let k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      let kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === "undefined" ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  })();
  Array.isArray = function (arg: any): arg is any[] {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new Error("Array.prototype.find called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new Error("predicate must be a function");
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };

  Object.keys = (function () {
    let hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
      dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
      dontEnumsLength = dontEnums.length;

    return function (obj: any) {
      if ((typeof obj !== "object" && typeof obj !== "function") || obj === null) throw new Error("Object.keys called on non-object");
      const result = [];
      for (let prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }
      if (hasDontEnumBug) {
        for (let i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    };
  })();
};

export default Polyfill;
