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
  container.on(eventName, function(){return;}, 1);

  const actual = container["store"].get(eventName) as {
    type: "event";
    value: Event<unknown>;
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.value.count).toBe(1);
});
