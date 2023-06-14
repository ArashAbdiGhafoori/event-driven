import { safe_not_equal } from "../../src/util";

test("safe_not_equal test function", () => {
  const obj = {};
  const s = () => {
    return;
  };
  expect(safe_not_equal(NaN, NaN)).toBeFalsy();
  expect(safe_not_equal(obj, obj)).toBeTruthy();
  expect(safe_not_equal(s, s)).toBeTruthy();
});
