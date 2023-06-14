export default interface Subscribe<T> {
  (data: T): void;
}
