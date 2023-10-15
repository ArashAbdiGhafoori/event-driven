import { BaseContainer } from "./container.base";
import { Event, Listener, Request, Handler } from "./types";
import { StoreEntry } from "./types/StoreEntry";

export class EventContainer extends BaseContainer {
  public store: Map<string, StoreEntry> = new Map<string, StoreEntry>();

  /** Listen to the specified event. optionally you can register it here.
   *
   * @param name The name of the event to listen.
   * @param callback The callback to fire when event happens
   * @param register Should automatically register the event if it's not there?
   * @param count If register is set to true, The number of times the event can be fired.
   */
  public on<T>(name: string, callback: Listener<T>, count = -1): void {
    this.resolve<Event<T>>(name, "event")?.listeners.push(
      callback as Listener<T>
    ) ??
      this.store.set(name, {
        type: "event",
        value: { name, count, listeners: [callback] },
      });
  }

  public off(name: string) {
    this.store.delete(name);
  }

  /** Fires the specified event with the input data.
   *
   * @param name The name of the event to fire.
   * @param eventData The Date to fire the event with.
   */
  public fire<T>(name: string, eventData: T): void {
    const event = this.resolve<Event<T>>(name, "event");
    if (!event || event.listeners.length <= 0 || event.count === 0) return;
    for (let i = 0; i < event.listeners.length; i++)
      event.listeners[i](eventData);
    if (event) event.count > 0 ? event.count-- : null;
  }

  /** Sends a request to handle.
   *
   * @param request The request to handle.
   * @returns The response of handler.
   */
  public handle<T extends Request<J>, J>(request: T): J | undefined {
    const handler = this.resolve<Handler<T, J>>(request.name, "handler");
    return handler?.handle(request);
  }

  /**
   * Register a handler for requests.
   * Doesn't provide a type check.
   * 
   * @param name name of request type to handle
   * @param handle the function to handle request with
   */
  public register_handler = <T extends Request<J>, J>(
    name: string,
    handle: (request: T) => J
  ) => {
    this.store.set(name, { type: "handler", value: { name, handle } });
  };
}
