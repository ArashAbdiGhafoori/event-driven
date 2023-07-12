import Container from "../../../src/container";
import mediator from "../../../src/main";
import { Pipe } from "../../../src/types";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true);
});

test("pipeline should register", () => {
  const pipelineName = "PiplineName";
  container.register.pipe(pipelineName, (input: string) => {
    return `you said: ${input}`;
  });
  const actual = container["store"].get(pipelineName) as {
    type: "pipeline";
    value: { name: string; pipes: Pipe<string>[] };
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.value.name).toBe(pipelineName);
});

test("pipe should register", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
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
