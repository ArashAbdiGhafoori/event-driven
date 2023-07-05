import type {
  Readable,
  Writable,
  Handler,
  Request,
  Event,
  Listener,
  StartStopNotifier,
  Pipe,
  Subscribe,
  Unsubscribe,
  Update,
  Pipeline,
  ServiceContainer,
} from "./types";

import { safe_not_equal, noop } from "./util";

export interface StoreEntry {
  type: "readable" | "writable" | "event" | "pipeline" | "handler" | "service";
  value: unknown;
}

export default class Container {
  private store: Map<string, StoreEntry> = new Map<string, StoreEntry>();

  //#region event

  /** Listen to the specified event. optionally you can register it here.
   *
   * @param name The name of the event to listen.
   * @param callback The callback to fire when event happens
   * @param register Should automatically register the event if it's not there?
   * @param count If register is set to true, The number of times the event can be fired.
   */
  public on<T>(
    name: string,
    callback: Listener<T>,
    register = false,
    count = -1
  ): void {
    let event = this.resolve<Event<T>>(name, "event");
    if (register && !event) {
      this.register.event(name, count);
      event = this.resolve<Event<T>>(name, "event");
    }
    if (event) {
      event.listeners.push(callback as Listener<T>);
    }
  }

  /** Fires the specified event with the input data.
   *
   * @param name The name of the event to fire.
   * @param eventData The Date to fire the event with.
   */
  public fire<T>(name: string, eventData: T): void {
    const event = this.resolve<Event<T>>(name, "event");
    if (!event || event.listeners.length <= 0 || event.count === 0) return;
    for (let i = 0; i < event.listeners.length; i++) {
      const listener = event.listeners[i];
      listener(eventData);
    }
    this.reduceEventCount(name);
  }

  /** Reduces the count on event by 1.
   *
   * @param name The name of the event, which it's count should reduce.
   */
  private reduceEventCount(name: string): void {
    const event = this.resolve<Event<unknown>>(name, "event");
    if (event) event.count > 0 ? event.count-- : null;
  }
  //#endregion

  //#region cqrs

  /** Sends a request to handle.
   *
   * @param request The request to handle.
   * @returns The response of handler.
   */
  public handle<T extends Request<J>, J>(request: T): J | undefined {
    const handler = this.resolve<Handler<T, J>>(request.name, "handler");
    return handler?.handle(request);
  }
  //#endregion

  //#region pipline

  /** Pipe a value to the specified pipeline and get the output.
   *
   * @param pipeline The pipeline to use
   * @param input The input.
   * @returns The output.
   */
  public pipe<T>(pipeline: string, input: T): T {
    const line = this.resolve<Pipeline<T>>(pipeline, "pipeline");
    line?.pipes.forEach((p) => {
      input = p(input);
    });
    return input;
  }
  //#endregion

  //#region store

  /** Creates a writable store.
   *
   * @param name The Name of the store.
   * @param value The value to create the store with.
   * @param start The notifier.
   * @returns The store.
   */
  public writable<T>(
    name: string,
    value?: T,
    start: StartStopNotifier<T> = noop
  ): Writable<T> {
    let stop: Unsubscribe;
    const subscribers: Set<Subscribe<T>> = new Set();

    function set(new_value: T): void {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop === noop) {
          subscribers.forEach((subscriber) => {
            subscriber(value as T);
          });
        }
      }
    }

    function update(fn: Update<T>): void {
      set(fn(value as T));
    }

    function subscribe(subscribe: Subscribe<T>): Unsubscribe {
      subscribers.add(subscribe);
      if (subscribers.size === 1) {
        stop = start(set) || noop;
      }
      subscribe(value as T);

      return () => {
        subscribers.delete(subscribe);
        if (subscribers.size === 0 && stop !== noop) {
          stop();
          stop = noop;
        }
      };
    }

    return { name, set, update, subscribe };
  }

  /** Creates a readable store.
   *
   * @param name The Name of the store.
   * @param value The value to create the store with.
   * @param start The notifier.
   * @returns The store.
   */
  public readable<T>(
    name: string,
    value?: T,
    start: StartStopNotifier<T> = noop
  ): Readable<T> {
    return {
      name: name,
      subscribe: this.writable(name, value, start).subscribe,
    };
  }
  //#endregion

  /** Resolves entries to types
   *
   * @param name The name of the entry to resolve.
   * @param type The type to resolve
   * @returns The resolved entry.
   */
  private resolve<T>(
    name: string,
    type: "readable" | "writable" | "event" | "pipeline" | "handler" | "service"
  ) {
    const entry = this.store.get(name);
    if (entry && entry.type == type && entry.value) {
      return entry.value as T;
    }
  }

  private get_readable_store = <T>(name: string) => {
    return this.resolve<Readable<T>>(name, "readable");
  };

  private get_writable_store = <T>(name: string) => {
    return this.resolve<Writable<T>>(name, "writable");
  };

  private get_service = <T>(name: string) => {
    const service = this.resolve<ServiceContainer<T>>(name, "service");
    const factory = service?.factory;
    if (service && service.life == "Singleton") return service.instance;
    if (factory) return factory();
  };

  public readonly get = {
    /** Get a readable store.
     *
     * @param name The name of the readable store
     * @returns The store
     */
    readable: this.get_readable_store,

    /** Get a writable store.
     *
     * @param name The name of the writable store
     * @returns The store
     */
    writable: this.get_writable_store,

    /** Get an instance of a service
     *
     * @param name The name of the service
     * @returns The service
     */
    service: this.get_service,
  };

  // FIXME Invalidation & Rapid changes
  private register_writable = <T>(
    name: string,
    value?: T,
    start: StartStopNotifier<T> = noop
  ) => {
    const writable = this.writable(name, value, start);
    this.store.set(name, { type: "writable", value: writable });
  };

  // FIXME Invalidation & Rapid changes
  private register_readable = <T>(
    name: string,
    value?: T,
    start: StartStopNotifier<T> = noop
  ) => {
    const readable = this.readable(name, value, start);
    this.store.set(name, { type: "readable", value: readable });
  };

  private register_service = <T extends ServiceContainer<J>, J>(service: T) => {
    if (!this.store.has(service.name)) {
      this.store.set(service.name, { type: "service", value: service });
    }
  };

  private register_handler = <T extends Request<J>, J>(
    name: string,
    handle: (request: T) => J
  ) => {
    this.store.set(name, { type: "handler", value: { name, handle } });
  };

  private register_pipeline = (name: string) => {
    this.store.set(name, { type: "pipeline", value: { name, pipes: [] } });
  };

  private register_pipe = <T>(
    pipeline: string,
    pipe: Pipe<T>,
    at = 0,
    register = false
  ) => {
    if (!this.store.has(pipeline) && !register) {
      return;
    }
    if (!this.store.has(pipeline)) {
      this.register_pipeline(pipeline);
    }
    const pl = this.resolve<Pipeline<unknown>>(pipeline, "pipeline");
    if (pl) pl.pipes.splice(at, 0, pipe as Pipe<unknown>);
  };

  private register_event = (name: string, count = -1) => {
    this.store.set(name, {
      type: "event",
      value: { name, count, listeners: [] },
    });
  };

  public readonly register = {
    /** Register a writable store
     *
     * @param name The name of the store
     * @param value The initial value
     * @param start The notifier
     */
    writable: this.register_writable,

    /** Register a readable store
     *
     * @param name The name of the store
     * @param value The initial value
     * @param start The notifier
     */
    readable: this.register_readable,

    /** Register a service
     *
     * @param service The implementation of ServiceContainer<TService>
     */
    service: this.register_service,

    /** Register a cqrs handler
     *
     * @param name The name of handler
     * @param handle The callback to handle the request
     */
    handler: this.register_handler,

    /** Register a pipeline
     *
     * @param name The name of the pipeline
     */
    pipeline: this.register_pipeline,

    /** Register pipe
     *
     * @param pipeline The name of the pipeline to add the pipe to
     * @param pipe The pipe
     * @param at The position to add the pie at, default = 0
     * @param register Register the pipe if not already there
     */
    pipe: this.register_pipe,

    /** Register an event
     *
     * @param name The name of the event
     * @param count The number of times the event runs, default = -1 (unlimited)
     */
    event: this.register_event,
  };
}
