declare global {
	interface Array<T> {
		/**
		 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
		 * @param callback A function that accepts up to three arguments. The `map` method calls the callback function one time for each element in the array.
		 * @param thisArg An object to which the `this` keyword can refer in the callback function. If `thisArg` is omitted, undefined is used as the `this` value.
		 */
		map<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
		indexOf(searchElement: T, fromIndex?: number): number;
		reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;
	}
}

export {};
