import Readable from "./types/store/readable";
import Writable from "./types/store/writable";
import Event from "./types/event";
import Listener from "./types/functions/listener";
import StartStopNotifier from "./types/functions/notifier";
import { Pipe, Subscribe, Unsubscribe, Update } from "./types/functions";
import { safe_not_equal, noop } from "./util";
import Pipeline from "./types/pipeline";

// TODO Implement Container
export default class Container {
  //#region event
  private events: { [id: string]: Event<unknown> } = {};

  public on<T>(
    name: string,
    callback: Listener<T>,
    register = false,
    registerCount = -1
  ): void {
    if (typeof this.events[name] !== "undefined") {
      this.events[name].listeners.push(callback as Listener<unknown>);
    } else if (register) {
      this.register.event(name, registerCount);
      this.events[name].listeners.push(callback as Listener<unknown>);
    }
  }
  public fire<T>(name: string, eventData: T) {
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

  private reduceEventCount(name: string): void {
    this.events[name].count > 0 ? this.events[name].count-- : null;
  }
  //#endregion
  //#region cqrs
  //#endregion
  //#region pipline
  private pipelines: { [id: string]: Pipeline<unknown> } = {};

  public pipe<T>(pipeline: string, input: T): T {
    const line = this.pipelines[pipeline] as Pipeline<T>;
    line.pipes.forEach((p) => {
      console.log(input);
      input = p(input);
    });
    return input;
  }
  //#endregion
  //#region store
  private stores: { [id: string]: Writable<unknown> | Readable<unknown> } = {};

  // based on svelte source code here: https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
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

  // based on svelte source code here: https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
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

  public get get() {
    return {
      readable: <T>(name: string) => this.stores[name] as Readable<T>,
      writable: <T>(name: string) => this.stores[name] as Writable<T>,
    };
  }

  public get register() {
    return {
      pipeline: (name: string) => {
        this.pipelines[name] = { name, pipes: [] };
      },
      pipe: <T>(pipeline: string, pipe: Pipe<T>, at = 0, register = false) => {
        if (typeof this.pipelines[pipeline] === "undefined" && !register) {
          return;
        }
        if (typeof this.pipelines[pipeline] === "undefined") {
          this.register.pipeline(pipeline);
          this.pipelines[pipeline].pipes.splice(at, 0, pipe as Pipe<unknown>);
        }
        this.pipelines[pipeline].pipes.splice(at, 0, pipe as Pipe<unknown>);
      },
      // FIXME Invalidation & Rapid changes
      readable: <T>(
        name: string,
        value?: T,
        start: StartStopNotifier<T> = noop
      ): void => {
        const readable = this.readable(name, value, start);
        this.stores[name] = readable;
      },
      // FIXME Invalidation & Rapid changes
      writable: <T>(
        name: string,
        value?: T,
        start: StartStopNotifier<T> = noop
      ): void => {
        const writable = this.writable(name, value, start);
        this.stores[name] = writable;
      },
      event: (name: string, count = -1) => {
        this.events[name] = { name, count, listeners: [] };
      },
    };
  }
}
