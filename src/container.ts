import { StoreEntry } from "./types/StoreEntry";
import type {
  Readable,
  Writable,
  StartStopNotifier,
  Pipe,
  Subscribe,
  Unsubscribe,
  Update,
  Pipeline,
} from "./types";

import { safe_not_equal, noop } from "./util";
import { LightContainer } from "./container.light";

export default class Container extends LightContainer {
  public store: Map<string, StoreEntry> = new Map<string, StoreEntry>();

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

  private get_readable_store = <T>(name: string) => {
    return this.resolve<Readable<T>>(name, "readable");
  };

  private get_writable_store = <T>(name: string) => {
    return this.resolve<Writable<T>>(name, "writable");
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
    service: this.service,
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

  private register_pipe = <T>(pipeline: string, pipe: Pipe<T>, at = 0) => {
    if (!this.store.has(pipeline))
      this.store.set(pipeline, {
        type: "pipeline",
        value: { name: pipeline, pipes: [pipe as Pipe<unknown>] },
      });
    else {
      const pl = this.resolve<Pipeline<unknown>>(pipeline, "pipeline");
      if (pl) pl.pipes.splice(at, 0, pipe as Pipe<unknown>);
    }
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

    /** Register pipe
     *
     * @param pipeline The name of the pipeline to add the pipe to
     * @param pipe The pipe
     * @param at The position to add the pie at, default = 0
     * @param register Register the pipe if not already there
     */
    pipe: this.register_pipe,
  };
}
