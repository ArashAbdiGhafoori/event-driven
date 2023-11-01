import { Container } from "./container";
import { EventContainer } from "./container.event";
import { LightContainer } from "./container.light";

export class Mediator extends Container {
  public static instance: Mediator;
  private containers: { [id: string]: Container } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new Container();
    return this.containers[name];
  }
}

export class Light extends LightContainer {
  public static instance: Light;
  private containers: { [id: string]: LightContainer } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new LightContainer();
    return this.containers[name];
  }
}

export class Event extends EventContainer {
  public static instance: Event;
  private containers: { [id: string]: EventContainer } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new EventContainer();
    return this.containers[name];
  }
}
