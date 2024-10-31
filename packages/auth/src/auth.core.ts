import { isBrowser } from "@template/utils/assertion";

import type { AuthClientOptions } from "./types";

export class Core {
  protected logDebugMessages = true;
  protected api: AuthClientOptions["api"];

  constructor({
    logDebugMessages = true,
    api,
  }: Pick<AuthClientOptions, "logDebugMessages" | "api">) {
    this.logDebugMessages = logDebugMessages;
    this.api = api;
  }

  protected debug(...args: unknown[]) {
    if (this.logDebugMessages) {
      console.debug(
        `[Debug message][${isBrowser() ? "client" : "server"}] `,
        ...args,
      );
    }
    return this;
  }

  protected error(...args: unknown[]) {
    console.error(
      `[Error message][${isBrowser() ? "client" : "server"}] `,
      ...args,
    );
    return this;
  }
}
