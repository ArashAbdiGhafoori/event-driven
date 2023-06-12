export default interface Listener<T> {
  (eventData: T): void;
}
