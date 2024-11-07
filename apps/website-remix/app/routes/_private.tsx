import { Outlet } from "@remix-run/react";

export { loader } from "~/.server/routes/guard/protecting.loader";

export default function Routes() {
  return <Outlet />;
}
