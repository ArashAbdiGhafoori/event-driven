import Container from "../../../src/container";
import mediator from "../../../src/main";

const eventName = "EventName";
let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true);
});

test("event should fire", () => {

  let actual = "";
  container.on<{ message: string }>(eventName, (data) => {
    actual = data.message;
  });
  const message = "test message";

  container.fire(eventName, { message });
  expect(actual).toBe(message);
});

test("event should fire in order", () => {

  let actual = "";
  const expected = "test";
  container.on<{ message: string }>(eventName, (data) => {
    actual = data.message;
  });
  container.on<{ message: string }>(eventName, () => {
    actual = expected;
  });
  const message = "test message";

  container.fire(eventName, { message });
  expect(actual).toBe(expected);
});


test("event should fire once", () => {
  let actual = 0;
  container.on(eventName, () => {
    actual++;
  }, 1);

  const count = 3;
  for (let i = 0; i < count; i++) {
    container.fire(eventName, {});
  }

  expect(actual).toBe(1);
});

test("event should fire forever", () => {

  let actual = 0;
  container.on(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    container.fire(eventName, {});
  }

  expect(actual).toBe(count);
});
