import Container from "../../../src/container";
import evma from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
});

test("writable should register", () => {
  const storeName = "StoreName";

  container.register.writable(storeName, "WOW");
  const actual = container.get.writable(storeName);
  expect(actual).toBeDefined();
  expect(actual.name).toBe(storeName);
  expect(actual.set).toBeDefined();
  expect(actual.update).toBeDefined();
  expect(actual.subscribe).toBeDefined();
});

test("readable should register", () => {
  const storeName = "StoreName";

  container.register.readable(storeName, "WOW");
  const actual = container.get.readable(storeName);
  expect(actual).toBeDefined();
  expect(actual.name).toBe(storeName);
  expect(actual.subscribe).toBeDefined();
});
