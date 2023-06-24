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

  const actual = container.get.service(serviceName) as Service<string>;
  expect(actual).toBeDefined();
  expect(actual).toBe(expected);
});

test("transient should not be available through container.get.service(<service-name>) without factory", () => {
  const serviceName = "ServiceName";
  container.register.service<Service<string>, string>({
    name: serviceName,
    life: "Transient",
  });

  const actual = container.get.service(serviceName) as Service<string>;
  expect(actual).not.toBeDefined();
});

test("transient should not be available through container.get.service(<service-name>) without register", () => {
  const serviceName = "ServiceName";

  const actual = container.get.service(serviceName) as Service<string>;
  expect(actual).not.toBeDefined();
});

describe("singleton-transient", () => {
  const serviceName = "ServiceName";

  const expectedSingleton = "ExpectedSingleton";
  const expectedTransient = "ExpectedTransient";

  const set = () => {
    container.register.service<Service<string>, string>({
      name: serviceName,
      life: "Both",
      instance: expectedSingleton,
      factory() {
        return expectedTransient;
      },
    });
  };

  test("should be available through container.get.service(<service-name>) and container.get.transient(<service-name>)", () => {
    set();
    const actual = container.get.service(serviceName) as string;
    expect(actual).toBeDefined();
    expect(actual).toBe(expectedSingleton);
  });

  test("should be available through and container.get.transient(<service-name>)", () => {
    set();
    const actual = container.get.transient(serviceName) as string;
    expect(actual).toBeDefined();
    expect(actual).toBe(expectedTransient);
  });

  test("should not be available through and container.get.transient(<service-name>)", () => {
    const actual = container.get.transient(serviceName) as string;
    expect(actual).not.toBeDefined();
  });
});
