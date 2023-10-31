import { mediator, Container } from "../../../src/index";
import ServiceContainer from "../../../src/types/di/serviceContainer";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true) as Container;
});

test("singleton should be available through container.get.service(<service-name>)", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  const serviceInstance = { test: expected };
  container.register.service({
    name: serviceName,
    life: "Singleton",
    instance: serviceInstance,
  });

  const actual = container.get.service(serviceName) as {
    test: string;
  };
  expect(actual).toBeDefined();
  expect(actual?.test).toBe(expected);
});

test("transient should be available through container.get.service(<service-name>)", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  container.register.service<ServiceContainer<string>, string>({
    name: serviceName,
    life: "Transient",
    factory() {
      return expected;
    },
  });

  const actual = container.get.service(serviceName) as ServiceContainer<string>;
  expect(actual).toBeDefined();
  expect(actual).toBe(expected);
});

test("transient should not be available through container.get.service(<service-name>) without factory", () => {
  const serviceName = "ServiceName";
  container.register.service<ServiceContainer<string>, string>({
    name: serviceName,
    life: "Transient",
  });

  const actual = container.get.service(serviceName) as ServiceContainer<string>;
  expect(actual).not.toBeDefined();
});

test("transient should not be available through container.get.service(<service-name>) without register", () => {
  const serviceName = "ServiceName";

  const actual = container.get.service(serviceName) as ServiceContainer<string>;
  expect(actual).not.toBeDefined();
});
