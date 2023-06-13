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
  actual.RegisterEvent(eventName);
  actual = evma.container(name);
  expect(actual["events"][eventName]).toBeDefined();
});
