import Listener from "./functions/listener";

export default interface Event<T> {
  name: string;
  count: number;
  listeners: Listener<T>[];
}
