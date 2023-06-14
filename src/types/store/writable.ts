import { Update } from "../functions";
import Readable from "./readable";

export default interface Writable<T> extends Readable<T> {
  name: string;
  set(this: void, value: T): void;
  update(this: void, updater: Update<T>): void;
}
