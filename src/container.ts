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

export default class Container {
  //#region di
  private items: Map<string, unknown> = new Map<string, unknown>();
  //#endregion

  //#region event
  private events = new Map<string, Event<unknown>>();

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
    let event = null;
    if (register && !this.events.has(name)) {
      this.register.event(name, count);
    }
    event = this.events.get(name);
    if (event) {
      event.listeners.push(callback as Listener<unknown>);
    }
  }

  /** Fires the specified event with the input data.
   *
   * @param name The name of the event to fire.
   * @param eventData The Date to fire the event with.
   */
  public fire<T>(name: string, eventData: T): void {
    const event = this.events.get(name);
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
    const event = this.events.get(name);
    if (event) event.count > 0 ? event.count-- : null;
  }
  //#endregion

  //#region cqrs
  private handlers = new Map<string, Handler<Request<unknown>, unknown>>();

  /** Sends a request to handle.
   *
   * @param request The request to handle.
   * @returns The response of handler.
   * @throws NotRegistered
   */
  public handle<T extends Request<J>, J>(request: T): J {
    const handler = this.handlers.get(request.name) as Handler<T, J>;
    return handler.handle(request);
  }
  //#endregion

  //#region pipline
  private pipelines = new Map<string, Pipeline<unknown>>();

  /** Pipe a value to the specified pipeline and get the output.
   *
   * @param pipeline The pipeline to use
   * @param input The input.
   * @returns The output.
   */
  public pipe<T>(pipeline: string, input: T): T {
    const line = this.pipelines.get(pipeline) as Pipeline<T>;
    line.pipes.forEach((p) => {
      input = p(input);
    });
    return input;
  }
  //#endregion

  //#region store
  private stores = new Map<string, Writable<unknown> | Readable<unknown>>();

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

  /** Get service, writable or readable stores.
   */
  public get get() {
    return {
      /** Get a readable store.
       *
       * @param name The name of the readable store
       * @returns The store
       */
      readable: <T>(name: string) => this.stores.get(name) as Readable<T>,

      /** Get a writable store.
       *
       * @param name The name of the writable store
       * @returns The store
       */
      writable: <T>(name: string) => this.stores.get(name) as Writable<T>,

      /** Get an instance of a service
       *
       * @param name The name of the service
       * @returns The service
       */
      service: <T>(name: string) => {
        const service: ServiceContainer<T> = this.items.get(
          name
        ) as ServiceContainer<T>;
        const factory = service?.factory;
        if (service && service.life == "Singleton") return service.instance;
        if (factory) return factory();
      },
    };
  }

  /** Register to the container.
   */
  public get register() {
    return {
      /** Register a service
       *
       * @param service The implementation of ServiceContainer<TService>
       */
      service: <T extends ServiceContainer<J>, J>(service: T) => {
        if (!this.items.has(service.name)) {
          this.items.set(service.name, service);
        }
      },
      /** Register a cqrs handler
       *
       * @param name The name of handler
       * @param handle The callback to handle the request
       */
      handler: <T extends Request<J>, J>(
        name: string,
        handle: (request: T) => J
      ) => {
        this.handlers.set(name, { name, handle });
      },
      /** Register a pipeline
       *
       * @param name The name of the pipeline
       */
      pipeline: (name: string) => {
        this.pipelines.set(name, { name, pipes: [] });
      },

      /** Register pipe
       *
       * @param pipeline The name of the pipeline to add the pipe to
       * @param pipe The pipe
       * @param at The position to add the pie at, default = 0
       * @param register Register the pipe if not already there
       */
      pipe: <T>(
        pipeline: string,
        pipe: Pipe<T>,
        at = 0,
        register = false
      ): void => {
        if (!this.pipelines.has(pipeline) && !register) {
          return;
        }
        if (!this.pipelines.has(pipeline)) {
          this.register.pipeline(pipeline);
        }
        const pl = this.pipelines.get(pipeline);
        if (pl) pl.pipes.splice(at, 0, pipe as Pipe<unknown>);
      },
      // FIXME Invalidation & Rapid changes
      /** Register a readable store
       *
       * @param name The name of the store
       * @param value The initial value
       * @param start The notifier
       */
      readable: <T>(
        name: string,
        value?: T,
        start: StartStopNotifier<T> = noop
      ): void => {
        const readable = this.readable(name, value, start);
        this.stores.set(name, readable);
      },
      // FIXME Invalidation & Rapid changes
      /** Register a writable store
       *
       * @param name The name of the store
       * @param value The initial value
       * @param start The notifier
       */
      writable: <T>(
        name: string,
        value?: T,
        start: StartStopNotifier<T> = noop
      ): void => {
        const writable = this.writable(name, value, start);
        this.stores.set(name, writable);
      },

      /**
       *
       * @param name The name of the event
       * @param count The number of times the event runs, default = -1 (unlimited)
       */
      event: (name: string, count = -1) => {
        this.events.set(name, { name, count, listeners: [] });
      },
    };
  }

  //#region aliases
  public service = this.get.service;
  public wstore = this.get.writable;
  public rstore = this.get.readable;
  //#endregion
}
