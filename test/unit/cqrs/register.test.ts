import { mediator, Container } from "../../../src/index";
import Request from "../../../src/types/cqrs/request";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = mediator.container(`${counter++}`, true) as Container;
});

test("handler should register", () => {
  const handlerName = "HandlerName";

  const expected = "expected";

  class R implements Request<string> {
    name = handlerName;
    value = "";
  }

  container.register.handler<R, string>(handlerName, () => {
    return expected;
  });

  const actual = container["store"].get(handlerName);
  expect(actual).toBeDefined();
});
