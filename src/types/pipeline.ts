import Pipe from "./functions/pipe";

export default interface Pipeline<T> {
  name: string;
  pipes: Pipe<T>[];
}
