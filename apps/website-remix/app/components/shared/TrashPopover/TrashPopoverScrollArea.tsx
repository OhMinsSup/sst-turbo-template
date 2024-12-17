import { ScrollArea } from "@template/ui/components/scroll-area";

import { useBreadcrumb } from "~/hooks/useBreadcrumbs";
import { useInfinitWorkspaceTrashQuery } from "~/libs/queries/workspace.queries";
import { TrashItem } from "./TrashItem";

function TrashItemListTypeDashboard() {
  const { data } = useInfinitWorkspaceTrashQuery();

  return (
    <>
      {Array.from({ length: 200 }).map((_, index) => (
        <TrashItem key={index} />
      ))}
    </>
  );
}

export function TrashPopoverScrollArea() {
  const item = useBreadcrumb();

  return (
    <ScrollArea>
      {item?.type === "DASHBOARD" ? <TrashItemListTypeDashboard /> : null}
    </ScrollArea>
  );
}
