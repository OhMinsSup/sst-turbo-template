import { DashboardToolbar } from "~/components/dashboard/DashboardToolbar";
import { WorkspaceCardList } from "~/components/dashboard/WorkspaceCardList";

export { loader } from "~/.server/routes/workspaces/loaders/dashboard._dashboard._index.loader";
export { action } from "~/.server/routes/workspaces/actions/dashboard._dashboard._index.action";

export default function Routes() {
  return (
    <>
      <DashboardToolbar />
      <WorkspaceCardList />
    </>
  );
}
