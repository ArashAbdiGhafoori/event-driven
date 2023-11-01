import { mediator, Container } from "../../../src/index";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true) as Container;
});

test("pipe should not work when nothing is registered", () => {
  const pipelineName = "PiplineName";

  const input = "expected";
  const expected = "expected";

  const actual = container.pipe(pipelineName, input);
  expect(actual).toBe(expected);
});

test("pipe should work", () => {
  const pipelineName = "PiplineName";

  const i_string = "1";
  const expected = "expected";

  container.register.pipe(pipelineName, (i, next) => {
    if (i === "2") i = "3";
    return next(i);
  });

  container.register.pipe(pipelineName, (i, next) => {
    if (i === i_string) i = "2";
    i = next(i);
    if (i === "3") i = expected;
    return i;
  });

  const actual = container.pipe(pipelineName, i_string);

  expect(actual).toBe(expected);
});

test("pipe should work in order", () => {
  const pipelineName = "PiplineName";

  const i_string = "1_string";
  const nd_string = "2nd_string";
  const rd_string = "3nd_string";
  const expected = "expected";

  container.register.pipe(pipelineName, (input, next) => {
    if(input == nd_string) input = rd_string;
    return next(input)
  }, 1);
  container.register.pipe(pipelineName, (input, next) => {
    if(input == i_string) input = nd_string;
    return next(input)
  }, 0);
  container.register.pipe(pipelineName, (input, next) => {
    if(input == rd_string) input = expected;
    return next(input)
  }, 2);

  const actual = container.pipe(pipelineName, i_string);
  expect(actual).toBe(expected);
});
