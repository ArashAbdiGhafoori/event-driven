import { EventContainer } from "./container.event";

export default class Mediator extends EventContainer {
  public static instance: Mediator;
  private containers: { [id: string]: EventContainer } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new EventContainer();
    return this.containers[name];
  }
}
