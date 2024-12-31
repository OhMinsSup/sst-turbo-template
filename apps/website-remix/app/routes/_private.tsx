import { Outlet, useNavigation } from "@remix-run/react";

import { OverlayLoading } from "~/components/shared/OverlayLoading";
import { BreadcrumbProvider } from "~/providers/breadcrumb.provider";

export { loader } from "~/.server/loaders/protecting.loader";

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
    <BreadcrumbProvider>
      <Outlet />
      <OverlayLoading isLoading={isActionRedirect || isNavigating} />
    </BreadcrumbProvider>
  );
}
