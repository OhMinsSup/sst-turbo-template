import { Outlet } from "@remix-run/react";

export { loader } from "~/.server/routes/guard/loaders/public.loader";

export default function Routes() {
  return <Outlet />;
}
