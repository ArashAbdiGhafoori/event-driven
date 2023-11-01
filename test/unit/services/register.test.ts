import { LightContainer } from "../../../src/index";
import ServiceContainer from "../../../src/types/di/serviceContainer";

let container: LightContainer;
beforeEach(() => {
  container = new LightContainer();
});

test("singleton should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  const serviceInstance = { test: expected };
  container.register_service({
    name: serviceName,
    life: "Singleton",
    instance: serviceInstance,
  });

  const actual = container["store"].get(
    `s#${serviceName}`
  ) as ServiceContainer<{ test: string }>;
  expect(actual).toBeDefined();
  if (actual) {
    expect(actual.instance).toBeDefined();
    expect(actual.instance?.test).toBe(expected);
  }
});

test("transient should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  container.register_service<ServiceContainer<string>, string>({
    name: serviceName,
    life: "Transient",
    factory() {
      return expected;
    },
  });

  const actual = container["store"].get(
    `s#${serviceName}`
  ) as ServiceContainer<{ test: string }>;
  expect(actual).toBeDefined();
  expect(actual.factory).toBeDefined();
  if (actual.factory) {
    expect(actual.factory()).toBeDefined();
    expect(actual.factory()).toBe(expected);
  }
});
