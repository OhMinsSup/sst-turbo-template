import { Outlet, useNavigation } from "@remix-run/react";

import { OverlayLoading } from "~/components/shared/OverlayLoading";

export { loader } from "~/.server/routes/guard/protecting.loader";

export default function Routes() {
  const navigation = useNavigation();

  const isActionRedirect =
    navigation.state === "loading" &&
    navigation.formMethod != null &&
    navigation.formMethod != "GET" &&
    // We had a submission navigation and are now navigating to different location
    navigation.formAction !== navigation.location.pathname;

  const isNavigating = Boolean(navigation.location);

  return (
    <>
      <Outlet />
      <OverlayLoading isLoading={isActionRedirect || isNavigating} />
    </>
  );
}
