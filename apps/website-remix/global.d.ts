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

declare namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      // Auto generate by env-parse
      readonly NODE_ENV: string
  readonly SESSION_SECRET: string
    }
  }
