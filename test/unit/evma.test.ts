import evma from "../../src/main";

test("container should create with evma.container(<nonExistingName>)", () => {
  const name = "containerName";
  const actual = evma.container(name, true);
  expect(actual).toBeDefined();
});

test("container should return without reinitializing", () => {
  const name = "containerName";
  const eventName = "test";
  let actual = evma.container(name, true);
  actual.register.event(eventName);
  actual = evma.container(name);
  expect(actual["events"].get(eventName)).toBeDefined();
});
