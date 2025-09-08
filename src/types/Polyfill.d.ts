// String.prototype.split の型拡張

declare global {
  interface String {
    split(delimiter: string | RegExp, limit?: number): string[];
  }
  interface Array<T> {
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callback A function that accepts up to three arguments. The `map` method calls the callback function one time for each element in the array.
     * @param thisArg An object to which the `this` keyword can refer in the callback function. If `thisArg` is omitted, undefined is used as the `this` value.
     */
    map<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
    indexOf(searchElement: T, fromIndex?: number): number;
    reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: T, fromIndex?: number): boolean;
    filter(callback: (value: T, index: number, array: T[]) => boolean): T[];
  }

  interface ArrayLike<T> {
    length: number;
    [n: number]: T;
  }
  interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapFn?: (v: T, k: number) => U, thisArg?: any): U[];
    isArray(arg: any): arg is any[];
  }

  interface ObjectConstructor {
    keys(o: object): string[];
  }
}

export default function Polyfill(): void;
