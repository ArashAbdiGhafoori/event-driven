import Subscribe from "./subscribe";
import Unsubscribe from "./unsubscribe";

export default interface StartStopNotifier<T> {
  (set: Subscribe<T>): Unsubscribe | void;
}
