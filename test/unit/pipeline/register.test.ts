import Container from "../../../src/container";
import mediator from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true);
});

test("pipeline should register", () => {
  const pipelineName = "PiplineName";
  container.register.pipeline(pipelineName);
  const actual = container["store"].get(pipelineName) as {
    type: "pipeline";
    value: { name: string; pipes: (i: unknown) => unknown[] };
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.value.name).toBe(pipelineName);
});

test("pipe should register", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipeline(pipelineName);
  container.register.pipe(pipelineName, fn);

  const actual = container["store"].get(pipelineName) as {
    type: "pipeline";
    value: { name: string; pipes: Array<(i: unknown) => unknown> };
  };
  expect(actual).toBeDefined();
  if (actual) {
    expect(actual.value.pipes.length).toBe(1);
    expect(actual.value.pipes[0]).toEqual(fn);
  }
});

test("pipe should register pipeline pipe(register: true)", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipe(pipelineName, fn, 0, true);
  const actual = container["store"].get(pipelineName) as {
    type: "pipeline";
    value: { name: string; pipes: (i: unknown) => unknown[] };
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.value.name).toBe(pipelineName);
});

test("pipe should not register pipeline pipe(register: false) or default", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipe(pipelineName, fn);
  const actual = container["store"].get(pipelineName) as {
    type: "pipeline";
    value: { name: string; pipes: (i: unknown) => unknown[] };
  };
  expect(actual).not.toBeDefined();
});
