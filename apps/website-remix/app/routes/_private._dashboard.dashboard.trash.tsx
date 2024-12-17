import React from "react";

import { TrashCardList } from "~/components/trash/TrashCardList";
import { TrashToolbar } from "~/components/trash/TrashToolbar";

export { loader } from "~/.server/routes/workspaces/loaders/dashboard._dashboard.dashboard.trash.loader";

export default function Routes() {
  return (
    <>
      <TrashToolbar />
      <TrashCardList />
    </>
  );
}
