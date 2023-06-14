import { Subscribe, Unsubscribe } from "../functions";

export default interface Readable<T> {
  name: string;
  subscribe(this: void, run: Subscribe<T>): Unsubscribe;
}
