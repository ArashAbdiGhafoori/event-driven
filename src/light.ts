import Mediator from "./mediator.light";

/**
 * A static instance of LightContainer.
 *
 * It is a lighter version of the mediator that only has dependency injection, event and cqrs features.
 */
const MediatorInstance = (() => {
  Mediator.instance = Mediator.instance || new Mediator();
  return Mediator.instance;
})();

export { MediatorInstance as mediator };
