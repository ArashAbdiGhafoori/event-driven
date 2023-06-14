import evma from "../../../src/main";

const eventName = "EventName";

test("event should fire", () => {
  evma.register.event(eventName);

  let actual = "";
  evma.on<{ message: string }>(eventName, (data) => {
    actual = data.message;
  });
  const message = "test message";

  evma.fire(eventName, { message });
  expect(actual).toBe(message);
});

test("event should fire once", () => {
  evma.register.event(eventName, 1);

  let actual = 0;
  evma.on(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    evma.fire(eventName, {});
  }

  expect(actual).toBe(1);
});

test("event should fire forever", () => {
  evma.register.event(eventName);

  let actual = 0;
  evma.on(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    evma.fire(eventName, {});
  }

  expect(actual).toBe(count);
});
