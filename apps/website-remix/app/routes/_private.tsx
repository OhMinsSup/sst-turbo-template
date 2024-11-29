import { Outlet } from "@remix-run/react";

import { OverlayLoading } from "~/components/shared/OverlayLoading";
import { useLoadingStore } from "~/store/useLoadingStore";

export { loader } from "~/.server/routes/guard/protecting.loader";

export default function Routes() {
  const loadingState = useLoadingStore((state) => state.loadingState);
  return (
    <>
      <Outlet />
      <OverlayLoading isLoading={loadingState === "loading"} />
    </>
  );
}
