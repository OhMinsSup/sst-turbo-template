import { Outlet } from "@remix-run/react";

import { EditorLayout } from "~/components/editor/EditorLayout";

export default function Routes() {
  return (
    <EditorLayout>
      <Outlet />
    </EditorLayout>
  );
}
