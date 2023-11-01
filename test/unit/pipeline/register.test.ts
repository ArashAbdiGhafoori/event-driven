import { Container } from "../../../src/index";
import { Pipe } from "../../../src/types";

let container: Container;
beforeEach(() => {
  container = new Container();
});

test("pipeline should register", () => {
  const pipelineName = "PiplineName";
  container.register.pipe(pipelineName, (input: string, next) => {
    next(input);
    return `you said: ${input}`;
  });
  container.register.pipe(pipelineName, (input: string, next) => {
    next(input);
    return `you said: ${input}`;
  });
  container.register.pipe(pipelineName, (input: string, next) => {
    next(input);
    return `you said: ${input}`;
  });
  const actual = container["store"].get(`p#${pipelineName}`) as {
    name: string;
    pipes: Pipe<string>[];
  };
  expect(actual).toBeDefined();
  if (actual) expect(actual.name).toBe(pipelineName);
  if (actual) expect(actual.pipes.length).toBe(3);
});

test("pipe should register", () => {
  const pipelineName = "PiplineName";
  const fn = (i: unknown) => i;
  container.register.pipe(pipelineName, fn);

  const actual = container["store"].get(`p#${pipelineName}`) as {
    name: string;
    pipes: Pipe<unknown>[];
  };
  expect(actual).toBeDefined();
  if (actual) {
    expect(actual.pipes.length).toBe(1);
    expect(actual.pipes[0]).toEqual(fn);
  }
});
