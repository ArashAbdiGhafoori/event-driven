import Container from "../../../src/container";
import { mediator } from "../../../src/index";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true);
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

  const i_string = "1_string";
  const nd_string = "2nd_string";
  const rd_string = "3nd_string";
  const expected = "expected";

  const p1 = (i: string): string => (i === i_string ? nd_string : "");
  const p2 = (i: string): string => (i === nd_string ? rd_string : "");
  const p3 = (i: string): string => (i === rd_string ? expected : "");

  container.register.pipe(pipelineName, p3);
  container.register.pipe(pipelineName, p2);
  container.register.pipe(pipelineName, p1);

  const actual = container.pipe(pipelineName, i_string);
  expect(actual).toBe(expected);
});

test("pipe should work in order", () => {
  const pipelineName = "PiplineName";

  const i_string = "1_string";
  const nd_string = "2nd_string";
  const rd_string = "3nd_string";
  const expected = "expected";

  const p1 = (i: string): string => (i === i_string ? nd_string : "");
  const p2 = (i: string): string => (i === nd_string ? rd_string : "");
  const p3 = (i: string): string => (i === rd_string ? expected : "");

  container.register.pipe(pipelineName, p2);
  container.register.pipe(pipelineName, p1, 0);
  container.register.pipe(pipelineName, p3, 2);

  const actual = container.pipe(pipelineName, i_string);
  expect(actual).toBe(expected);
});
