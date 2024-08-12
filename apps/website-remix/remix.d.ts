declare namespace RemixDataFlow {
  export type Status = "success" | "error";

  export type Message = string | null;

  export interface Response<D = unknown, E = unknown> {
    status: Status;
    result: D;
    message: Message;
    errors: E;
  }
}
