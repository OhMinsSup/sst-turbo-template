import { Outlet } from "@remix-run/react";

export { loader } from "~/.server/routes/auth/auth.loader";

export default function Routes() {
  return <Outlet />;
}
