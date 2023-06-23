import Container from "../../../src/container";
import evma from "../../../src/main";
import Service from "../../../src/types/di/service";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
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
  container.register.service<Service<string>, string>({
    name: serviceName,
    life: "Transient",
    factory() {
      return expected;
    },
  });

  const actual = container.get.service(serviceName) as Service<{
    test: string;
  }>;
  expect(actual).toBeDefined();
  expect(actual).toBe(expected);
});
