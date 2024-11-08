import Polyfill from "./../Polyfill/Polyfill";

import { getTextframeIndex } from "./../diaryGekkanStructure";
import { expect, test } from "vitest";

test("hoge", () => {
	Polyfill();
	expect(getTextframeIndex(0, 15, 0)[0]).toBe(1);
	expect(getTextframeIndex(0, 15, 0)[1]).toBe(2);

	expect(getTextframeIndex(0, 15, 9)[0]).toBe(20);
	expect(getTextframeIndex(0, 15, 9)[1]).toBe(3);

	expect(getTextframeIndex(16, 29, 0)[0]).toBe(2);
	expect(getTextframeIndex(16, 29, 0)[1]).toBe(3);
});
