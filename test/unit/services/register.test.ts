import Container from "../../../src/container";
import evma from "../../../src/main";
import ServiceContainer from "../../../src/types/di/serviceContainer";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
});

test("singleton should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  const serviceInstance = { test: expected };
  container.register.service({
    name: serviceName,
    life: "Singleton",
    instance: serviceInstance,
  });

  const actual = container["store"].get(serviceName) as {
    type: "service";
    value: ServiceContainer<{
      test: string;
    }>;
  };
  expect(actual).toBeDefined();
  if (actual) {
    expect(actual.value.instance).toBeDefined();
    expect(actual.value.instance?.test).toBe(expected);
  }
});

test("transient should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  container.register.service<ServiceContainer<string>, string>({
    name: serviceName,
    life: "Transient",
    factory() {
      return expected;
    },
  });

  const actual = container["store"].get(serviceName) as {
    type: "service";
    value: ServiceContainer<{
      test: string;
    }>;
  };
  expect(actual).toBeDefined();
  expect(actual.value.factory).toBeDefined();
  if (actual.value.factory) {
    expect(actual.value.factory()).toBeDefined();
    expect(actual.value.factory()).toBe(expected);
  }
});
