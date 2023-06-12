import Event from "./types/event";
import Listener from "./types/functions/listener";

// TODO Implement Container
export default class Container {
  //#region event
  private events: { [id: string]: Event<unknown> } = {};

  public On<T>(
    name: string,
    callback: Listener<T>,
    register = false,
    registerCount = -1
  ): void {
    if (typeof this.events[name] !== "undefined") {
      this.events[name].listeners.push(callback as Listener<unknown>);
    } else if (register) {
      this.RegisterEvent(name, registerCount);
      this.events[name].listeners.push(callback as Listener<unknown>);
    }
  }
  public Fire<T>(name: string, eventData: T) {

    if (
      typeof this.events[name] === "undefined" ||
      this.events[name].listeners.length <= 0 ||
      this.events[name].count === 0
    ) {
      return;
    }
    for (let i = 0; i < this.events[name].listeners.length; i++) {
      const listener = this.events[name].listeners[i];
      listener(eventData);
    }
    this.reduceEventCount(name);
  }
  public RegisterEvent(name: string, count = -1) {
    this.events[name] = { name, count, listeners: [] };
  }

  private reduceEventCount(name: string): void {
    this.events[name].count > 0 ? this.events[name].count-- : null;
  }
  //#endregion
  //#region cqrs
  //#endregion
  //#region pipline
  //#endregion
  //#region store
  //#endregion
}
