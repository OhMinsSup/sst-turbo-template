import { useFetcher } from "@remix-run/react";

import type { RoutesActionData } from "~/.server/routes/root/root.action";

export const useSignOut = () => {
  const fetcher = useFetcher<RoutesActionData>();

  const _useSignOut = () => {
    const formData = new FormData();
    fetcher.submit(formData, { action: "/signout", method: "POST" });
  };

  return {
    signOut: _useSignOut,
    isLoading: fetcher.state === "loading",
  };
};
