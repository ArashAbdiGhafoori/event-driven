import type Request from "./request";

export default interface Handler<T extends Request<J>, J> {
  name: string;
  handle(request: T): J;
}
