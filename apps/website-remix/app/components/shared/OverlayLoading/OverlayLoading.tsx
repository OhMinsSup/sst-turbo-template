import { Deferred } from "@template/ui/common-components/deferred";

import { Icons } from "~/components/icons";

interface OverlayLoadingProps {
  isLoading: boolean;
}

export default function OverlayLoading({ isLoading }: OverlayLoadingProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <Deferred>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Icons.Spinner className="size-12 animate-spin text-primary" />
      </div>
      <div className="pointer-events-none fixed inset-0 z-50 bg-background opacity-75" />
    </Deferred>
  );
}
