import { mediator, Handler } from "../../../src/index";

test("handler decorator should register handler", () => {
  let count = 0;

  class CommandHandler {
    @Handler(mediator, { name: "test", context: CommandHandler })
    not_test({ input }: { input: number }) {
      return count + input;
    }
  }

  count = mediator.handle({ name: "test", input: 3 }) as number;
  expect(count).toBe(3);
});

test("handler decorator should register handler with method name", () => {
  let count = 0;

  class CommandHandler {
    @Handler(mediator)
    test({ input }: { input: number }) {
      return count + input;
    }
  }

  count = mediator.handle({ name: "test", input: 3 }) as number;
  expect(count).toBe(3);
});
