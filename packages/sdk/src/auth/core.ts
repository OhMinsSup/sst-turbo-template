import { isBrowser } from "@template/utils/assertion";

import type { AuthClientOptions } from "./types";
import { ApiClient } from "../api/api.client";

export class Core {
  protected logDebugMessages = true;
  protected api: ApiClient;

  constructor({
    logDebugMessages = true,
    url,
    apiClientOptions,
  }: Pick<AuthClientOptions, "logDebugMessages" | "url" | "apiClientOptions">) {
    this.logDebugMessages = logDebugMessages;

    this.api = new ApiClient({
      url,
      ...apiClientOptions,
    });
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
