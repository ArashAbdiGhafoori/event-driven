import Container from "../../../src/container";
import mediator from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true);
});

test("store should set", () => {
  const storeName = "StoreName";

  const expected = "TestInput";
  const store = container.writable(storeName, "unexpected value");

  let actual = "";
  store.subscribe((s) => {
    actual = s;
  });
  store.set(expected);

  expect(actual).toBe(expected);
});

test("store should run subscribe at least once", () => {
  const storeName = "StoreName";

  const expected = 1;
  const store = container.writable(storeName, 1);

  let actual = 0;
  store.subscribe((s) => {
    actual = s;
  });
  expect(actual).toBe(expected);
});

test("store should update", () => {
  const storeName = "StoreName";

  const expected = 3;
  const store = container.writable(storeName, 1);

  let actual = 0;
  store.subscribe((s) => {
    actual = s;
  });

  store.update((i) => i + 1);
  store.update((i) => i + 1);

  expect(actual).toBe(expected);
});

test("store should unsubscribe", () => {
  const storeName = "StoreName";

  const expected = 3;
  let actual = 0;
  const store = container.writable(storeName, 1, () => {
    return () => {
      actual = expected;
    };
  });

  const unsub = store.subscribe((s) => {
    actual = s;
  });
  unsub();

  expect(actual).toBe(expected);
});
