import Container from "../../../src/container";
import evma from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
});

test("pipeline should register", () => {
  const pipelineName = "PiplineName";
  container.register.pipeline(pipelineName);
  expect(container["pipelines"][pipelineName]).toBeDefined();
  expect(container["pipelines"][pipelineName].name).toBe(pipelineName);
});

test("pipe should register", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipeline(pipelineName);
  container.register.pipe(pipelineName, fn);

  expect(container["pipelines"][pipelineName].pipes.length).toBe(1);
  expect(container["pipelines"][pipelineName].pipes[0]).toEqual(fn);
});

test("pipe should register pipeline pipe(register: true)", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipe(pipelineName, fn, 0, true);
  expect(container["pipelines"][pipelineName]).toBeDefined();
  expect(container["pipelines"][pipelineName].name).toBe(pipelineName);
});

test("pipe should not register pipeline pipe(register: false) or deefault", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipe(pipelineName, fn);
  expect(container["pipelines"][pipelineName]).not.toBeDefined();
});
