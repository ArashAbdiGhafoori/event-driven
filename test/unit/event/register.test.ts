import Container from "../../../src/container";
import evma from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
});

test("event should register", () => {
  const eventName = "EventName";
  container.register.event(eventName, 1);

  const actual = container["events"].get(eventName);
  expect(actual).toBeDefined();
  if (actual) expect(actual.count).toBe(1);
});

test("event should register on on(register: true)", () => {
  const eventName = "EventName";
  container.on(
    eventName,
    () => {
      return;
    },
    true,
    1
  );
  const actual = container["events"].get(eventName);
  expect(actual).toBeDefined();
  if (actual) expect(actual.count).toBe(1);
});
