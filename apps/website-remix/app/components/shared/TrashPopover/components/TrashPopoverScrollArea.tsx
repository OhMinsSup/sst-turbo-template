import { Icons } from "~/components/icons";
import { useBreadcrumb } from "~/hooks/useBreadcrumbs";
import { TrashItemListTypeDashboard } from "./TrashItemListTypeDashboard";

interface TrashPopoverScrollAreaProps {
  deferredQuery: string;
  isPending: boolean;
}

export function TrashPopoverScrollArea({
  deferredQuery,
  isPending,
}: TrashPopoverScrollAreaProps) {
  const item = useBreadcrumb();

  if (isPending) {
    return (
      <div className="flex size-full items-center justify-center">
        <Icons.Spinner className="mx-auto h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {item?.type === "DASHBOARD" ? (
        <TrashItemListTypeDashboard deferredQuery={deferredQuery} />
      ) : null}
    </>
  );
}
