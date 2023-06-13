import evma from "../../../src/main";

const eventName = "EventName";

test("event should fire", () => {
  evma.RegisterEvent(eventName);

  let actual = "";
  evma.On<{ message: string }>(eventName, (data) => {
    actual = data.message;
  });
  const message = "test message";

  evma.Fire(eventName, { message });
  expect(actual).toBe(message);
});

test("event should fire once", () => {
  evma.RegisterEvent(eventName, 1);

  let actual = 0;
  evma.On(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    evma.Fire(eventName, {});
  }

  expect(actual).toBe(1);
});

test("event should fire forever", () => {
  evma.RegisterEvent(eventName);

  let actual = 0;
  evma.On(eventName, () => {
    actual++;
  });

  const count = 3;
  for (let i = 0; i < count; i++) {
    evma.Fire(eventName, {});
  }

  expect(actual).toBe(count);
});
