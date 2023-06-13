import Container from "../../../src/container";
import evma from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(()=>{
    container = evma.container(`${counter++}`, true);
})

test("event should register", () => {
  const eventName = "EventName";
  container.RegisterEvent(eventName, 1);

  expect(container["events"][eventName]).toBeDefined();
  expect(container["events"][eventName].count).toBe(1);
});

test("event should register on On(register: true)", () => {
  const eventName = "EventName";
  container.On(
    eventName,
    () => {
      return;
    },
    true,
    1
  );
  expect(container["events"][eventName]).toBeDefined();
  expect(container["events"][eventName].count).toBe(1);
});