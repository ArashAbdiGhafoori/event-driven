import { mediator, Container } from "../../../src/index";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true) as Container;
});

test("store should set", () => {
  const storeName = "StoreName";

  const expected = "TestInput";
  const store = container.readable(storeName, expected);

  let actual = "";
  store.subscribe((s) => {
    actual = s;
  });

  expect(actual).toBe(expected);
});

test("store should run subscribe at least once", () => {
  const storeName = "StoreName";

  const expected = 1;
  const store = container.readable(storeName, 1);

  let actual = 0;
  store.subscribe((s) => {
    actual = s;
  });
  expect(actual).toBe(expected);
});
