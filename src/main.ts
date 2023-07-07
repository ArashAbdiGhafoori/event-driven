import Container from "./container";

class mediator extends Container {
  public static instance: mediator;
  private containers: { [id: string]: Container } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new Container();
    return this.containers[name];
  }
}

if (typeof mediator.instance === "undefined")
  mediator.instance = new mediator();

export default mediator.instance;
