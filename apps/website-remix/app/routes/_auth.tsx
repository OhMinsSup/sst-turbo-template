import { Outlet } from "@remix-run/react";

import { Banner } from "~/components/shared/Banner";
import { SiteFooter } from "~/components/shared/SiteFooter";

export default function Routes() {
  return (
    <>
      <div className="h-screen">
        <Banner />
        <div className="absolute left-2/4 top-2/4 z-50 w-full -translate-x-2/4 -translate-y-2/4 px-4 sm:-translate-y-[40%] sm:px-0">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      {/* <QRcode /> */}
    </>
  );
}
