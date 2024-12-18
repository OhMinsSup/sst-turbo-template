import { DashboardToolbar } from "~/components/dashboard/DashboardToolbar";
import { WorkspaceCardList } from "~/components/dashboard/WorkspaceCardList";

export { loader } from "~/.server/loaders/_private._dashboard.dashboard._index.loader";
export { action } from "~/.server/actions/_private._dashboard.dashboard._index.action";

export default function Routes() {
  return (
    <>
      <DashboardToolbar />
      <WorkspaceCardList />
    </>
  );
}
