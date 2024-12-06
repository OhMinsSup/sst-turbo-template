import type { Session } from "@template/auth";

export interface CustomLoaderArgs {
  session: Session;
  headers: Request["headers"];
  useCache?: boolean;
}

export type CustomActionArgs = Omit<CustomLoaderArgs, "useCache">;

export type Truthy<T> = Exclude<T, 0 | "" | false | null | undefined>;

export type SearchParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams
  | undefined;
