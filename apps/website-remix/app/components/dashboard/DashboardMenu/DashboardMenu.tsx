import { useBreadcrumb } from "~/providers/breadcrumb.provider";
import { TypeDashboardMenu } from "./TypeDashboardMenu";
import { TypeTableMenu } from "./TypeTableMenu";

export default function DashboardMenu() {
  const data = useBreadcrumb();
  if (
    data?.type === "DASHBOARD" ||
    data?.type === "TRASH" ||
    data?.type === "SETTING"
  ) {
    return <TypeDashboardMenu />;
  }

  if (data?.type === "TABLE") {
    return <TypeTableMenu />;
  }

  return null;
}
