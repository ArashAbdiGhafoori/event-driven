import mediator from "../../../src/main";

const eventName = "EventName";

test("event should fire", () => {
  mediator.register.event(eventName);

  let actual = "";
  mediator.on<{ message: string }>(eventName, (data) => {
    actual = data.message;
  });
  const message = "test message";

  mediator.fire(eventName, { message });
  expect(actual).toBe(message);
});

test("event should fire once", () => {
  mediator.register.event(eventName, 1);

  let actual = 0;
  mediator.on(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    mediator.fire(eventName, {});
  }

  expect(actual).toBe(1);
});

test("event should fire forever", () => {
  mediator.register.event(eventName);

  let actual = 0;
  mediator.on(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    mediator.fire(eventName, {});
  }

  expect(actual).toBe(count);
});
