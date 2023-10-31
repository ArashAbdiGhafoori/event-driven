import { mediator, Container } from "../../../src/index";
import Request from "../../../src/types/cqrs/request";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true) as Container;
});

test("handler should return undefined when handler is not registered", () => {
  const handlerName = "HandlerName";

  const input = "input";
  const expected = "expected";

  class R implements Request<string> {
    name = handlerName;
    value?: string;
  }
  const actual = container.handle<R, string>({
    name: handlerName,
    value: input,
  });

  expect(actual).not.toBeDefined();
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
