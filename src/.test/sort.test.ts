import { expect, test } from "vitest";
import Polyfill from "./../_polyfill//Polyfill";
const testArray = [
	[11.5000000000001, 351.5],
	[99.5000000000001, 329],
	[11.5000000000001, 329],
	[55.5, 329],
	[55.5, 306.5],
	[99.5000000000001, 306.5],
	[11.5000000000001, 306.5],
	[55.5, 284],
	[11.5000000000001, 284],
	[66.5, 284],
	[55.5, 261.5],
	[11.5000000000001, 261.5],
];
const resultArray = [
	[[11.5000000000001, 351.5]],
	[
		[11.5000000000001, 329],
		[55.5, 329],
		[99.5000000000001, 329],
	],
	[
		[11.5000000000001, 306.5],
		[55.5, 306.5],
		[99.5000000000001, 306.5],
	],
	[
		[11.5000000000001, 284],
		[55.5, 284],
		[66.5, 284],
	],
	[
		[11.5000000000001, 261.5],
		[55.5, 261.5],
	],
];

function groupBySecondValue(arr: [number, number][]): [number, number][][] {
	const groups: { [key: number]: [number, number][] } = {};

	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];
		const key = item[1];
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
	}
	// y値の降順でグループ化
	return Object.entries(groups)
		.sort((a, b) => Number(b[0]) - Number(a[0]))
		.map(([, group]) => group.sort((a, b) => a[0] - b[0]));
}

test("groupBySecondValue", () => {
	expect(groupBySecondValue(testArray)).toEqual(resultArray);
});
