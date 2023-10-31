import type { EventContainer } from "../container.event";

export function Handler(
  container: EventContainer,
  options?: { name?: string; context?: new () => object }
) {
  return function (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const final_name = options?.name || key.toString();
    container.register_handler(final_name, (...args) => {
      const instance = options?.context ? new options.context() : target;
      const final = descriptor.value.bind(instance);
      return final(...args);
    });
  };
}
