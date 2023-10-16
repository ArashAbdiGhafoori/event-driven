import Container from "./container";

export default class Mediator extends Container {
  public static instance: Mediator;
  private containers: { [id: string]: Container } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new Container();
    return this.containers[name];
  }
}
