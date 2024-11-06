import { expect, test } from "vitest";
import polyfill from "../polyfill/polyfill";

test("polyfill", () => {
	// es3準拠のポリフィル
	polyfill();
	const arr = [1, 2, 3];
	const newArr = arr.map((v) => v * 2);
	expect(newArr).toEqual([2, 4, 6]);
});

test("polyfill", () => {
	// es3準拠のポリフィル
	polyfill();
	const arr = [1, 2, 3];
	const index = arr.indexOf(2);
	expect(index).toBe(1);
});

test("polyfill", () => {
	// es3準拠のポリフィル
	polyfill();
	const arr = [1, 2, 3];
	const index = arr.indexOf(4);
	expect(index).toBe(-1);
});

test("polyfill", () => {
	// es3準拠のポリフィル
	polyfill();
	const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const sum = arr.reduce((acc, cur) => acc + cur);
	expect(sum).toBe(45);
});
