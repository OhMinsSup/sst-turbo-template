// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { UserResponse } from "@template/sdk";
import type { Auth, Session } from "@template/sdk/auth";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      authenticates: Auth;
      safeGetSession: () => Promise<{
        session: Session | null;
        user: User | null;
      }>;
      session: Session | null;
      user: UserResponse | null;
    }
    interface PageData {
      session: Session | null;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
