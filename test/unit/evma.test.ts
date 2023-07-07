import mediator from "../../src/main";

test("container should create with mediator.container(<nonExistingName>)", () => {
  const name = "containerName";
  const actual = mediator.container(name, true);
  expect(actual).toBeDefined();
});

test("container should return without reinitializing", () => {
  const name = "containerName";
  const eventName = "test";
  let actual = mediator.container(name, true);
  actual.register.event(eventName);
  actual = mediator.container(name);
  expect(actual["store"].get(eventName)).toBeDefined();
});
