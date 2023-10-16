import { LightContainer } from "./container.light";

export default class Mediator extends LightContainer {
  public static instance: Mediator;
  private containers: { [id: string]: LightContainer } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new LightContainer();
    return this.containers[name];
  }
}
