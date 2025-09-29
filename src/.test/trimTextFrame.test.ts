import { expect, test } from "vitest";

import { trimString } from "./../_util/trimTextFrame";

test("trimString", () => {
  const testString = `あいうえお
かきくけこ
`;
  const result = trimString(testString);
  expect(result).toEqual(["あいうえお", "かきくけこ"]);
});