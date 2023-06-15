export default interface Pipe<T> {
  (input: T): T;
}
