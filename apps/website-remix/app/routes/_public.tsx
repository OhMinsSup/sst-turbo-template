import { Outlet } from "@remix-run/react";

export { loader } from "~/.server/loaders/public.loader";

export default function Routes() {
  return <Outlet />;
}
