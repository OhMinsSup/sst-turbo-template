import React from "react";

import { TrashCardList } from "~/components/trash/TrashCardList";
import { TrashToolbar } from "~/components/trash/TrashToolbar";

export { loader } from "~/.server/loaders/_private._dashboard.dashboard.trash.loader";

export default function Routes() {
  return (
    <>
      <TrashToolbar />
      <TrashCardList />
    </>
  );
}
