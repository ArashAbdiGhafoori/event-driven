import Container from "../../../src/container";
import evma from "../../../src/main";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
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

  container.register.pipeline(pipelineName);
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

  container.register.pipeline(pipelineName);
  container.register.pipe(pipelineName, p2);
  container.register.pipe(pipelineName, p1, 0);
  container.register.pipe(pipelineName, p3, 2);

  const actual = container.pipe(pipelineName, i_string);
  expect(actual).toBe(expected);
});
