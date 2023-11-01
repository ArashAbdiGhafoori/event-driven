import { mediator, event, light } from "../../src/index";

test("container should create with mediator.container(<nonExistingName>)", () => {
  {
    const name = "containerName";
    const actual = mediator.container(name, true);
    expect(actual).toBeDefined();
  }
  {
    const name = "containerName";
    const actual = event.container(name, true);
    expect(actual).toBeDefined();
  }
  {
    const name = "containerName";
    const actual = light.container(name, true);
    expect(actual).toBeDefined();
  }
});

test("container should return without reinitializing", () => {
  {
    const name = "containerName";
    const eventName = "test";
    let actual = mediator.container(name, true);
    actual.on(eventName, function () {
      return;
    });
    actual = mediator.container(name);
    expect(actual["store"].get(`e#${eventName}`)).toBeDefined();
  }
  {
    const name = "containerName";
    const eventName = "test";
    let actual = event.container(name, true);
    actual.on(eventName, function () {
      return;
    });
    actual = event.container(name);
    expect(actual["store"].get(`e#${eventName}`)).toBeDefined();
  }
  {
    const name = "containerName";
    const eventName = "test";
    let actual = light.container(name, true);
    actual.on(eventName, function () {
      return;
    });
    actual = light.container(name);
    expect(actual["store"].get(`e#${eventName}`)).toBeDefined();
  }
});
