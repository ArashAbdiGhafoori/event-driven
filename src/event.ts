import Mediator from "./mediator.event";

/**
 * A static instance of EventContainer.
 *
 * This is the simplest version of the mediator with only event and cqrs features.
 */
const MediatorInstance = (() => {
  Mediator.instance = Mediator.instance || new Mediator();
  return Mediator.instance;
})();

export { MediatorInstance as mediator };
