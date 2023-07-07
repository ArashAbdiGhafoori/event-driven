import Container from "../../../src/container";
import mediator from "../../../src/main";
import { Event } from "../../../src/types";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true);
});

test("event should register", () => {
  const eventName = "EventName";
  container.register.event(eventName, 1);

  const actual = container["store"].get(eventName) as {
    type: "event";
    value: Event<unknown>;
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.value.count).toBe(1);
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
  const actual = container["store"].get(eventName) as {
    type: "event";
    value: Event<unknown>;
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.value.count).toBe(1);
});
