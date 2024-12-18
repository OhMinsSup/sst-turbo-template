import { Outlet } from "@remix-run/react";

export { loader } from "~/.server/routes/auth/guards/loaders/public.loader";

export default function Routes() {
  return <Outlet />;
}
