import { Outlet } from "@remix-run/react";

import { Deferred } from "@template/ui/common-components/deferred";

import { Icons } from "~/components/icons";
import { useLoadingStore } from "~/store/useLoadingStore";

export { loader } from "~/.server/routes/guard/protecting.loader";

export default function Routes() {
  const loadingState = useLoadingStore((state) => state.loadingState);
  return (
    <>
      <Outlet />
      {loadingState === "loading" && (
        <Deferred>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Icons.Spinner className="size-12 animate-spin text-primary" />
          </div>
          <div className="pointer-events-none fixed inset-0 z-50 bg-background opacity-75" />
        </Deferred>
      )}
    </>
  );
}
