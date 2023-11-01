import { EventContainer } from "../../../src/index";
import { Event } from "../../../src/types";

let container: EventContainer;
beforeEach(() => {
  container = new EventContainer();
});

test("event should register", () => {
  const eventName = "EventName";
  container.on(
    eventName,
    function () {
      return;
    },
    1
  );

  const actual = container["store"].get(`e#${eventName}`) as Event<unknown>;
  expect(actual).toBeDefined();
  if (actual) expect(actual.count).toBe(1);
});

test("event should register multiple", () => {
  const eventName = "EventName";
  container.on(eventName, () => {
    return;
  });
  container.on(eventName, () => {
    return;
  });
  container.on(eventName, () => {
    return;
  });
  container.on(eventName, () => {
    return;
  });

  const actual = container["store"].get(`e#${eventName}`) as Event<unknown>;
  expect(actual).toBeDefined();
  if (actual) expect(actual.listeners.length).toBe(4);
});
