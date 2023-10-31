import { Mediator, Event, Light } from "./mediator";

/**
 * A static instance of mediator.
 *
 * It has all of the features (event, cqrs, dependency injection, pipeline, stores).
 */
const MediatorInstance = (() => {
  Mediator.instance = Mediator.instance || new Mediator();
  return Mediator.instance;
})();

/**
 * A static instance of EventContainer.
 *
 * This is the simplest version of the mediator with only event and cqrs features.
 */
const EventInstance = (() => {
  Event.instance = Event.instance || new Event();
  return Event.instance;
})();

/**
 * A static instance of LightContainer.
 *
 * It is a lighter version of the mediator that only has dependency injection, event and cqrs features.
 */
const LightInstance = (() => {
  Light.instance = Light.instance || new Light();
  return Light.instance;
})();

export { MediatorInstance as mediator };
export { EventInstance as event };
export { LightInstance as light };