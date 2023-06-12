import Container from "./container";

class evma extends Container {
  public static instance: evma;
  private containers: { [id: string]: Container } = {};

  public container(name: string, create = false) {
    if (this.containers[name]) return this.containers[name];
    if (create) this.containers[name] = new Container();
    return this.containers[name];
  }
}

if (typeof evma.instance === "undefined") evma.instance = new evma();

export default evma.instance;
