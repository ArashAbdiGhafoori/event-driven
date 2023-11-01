export default interface Pipe<T> {
  (input: T, next: (input: T) => T): T;
}
