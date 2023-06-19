import Container from "../../../src/container";
import evma from "../../../src/main";
import Request from "../../../src/types/cqrs/request";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
});

test("handler should handle", () => {
  const handlerName = "HandlerName";

  const input = "input";
  const expected = "expected";

  class R implements Request<string> {
    name = handlerName;
    value?: string;
  }

  container.register.handler<R, string>(handlerName, (r: R) => {
    return expected;
  });

  const actual = container.handle<R, string>({
    name: handlerName,
    value: input,
  });

  expect(actual).toBe(expected);
});
