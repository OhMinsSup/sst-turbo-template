import { Outlet } from "@remix-run/react";

export { loader } from "~/.server/routes/guard/public.loader";

export default function Routes() {
  return <Outlet />;
}
