import { useTransition } from "react";
import { useSearchParams } from "@remix-run/react";

import { DialogEditWorkspace } from "./DialogEditWorkspace";
import { PopoverFacetedFilter } from "./PopoverFacetedFilter";
import { SearchInput } from "./SearchInput";

export default function DashboardToolbar() {
  const [, startTransition] = useTransition();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTitle = searchParams.get("title") ?? "";

  const onChagneSearchParams = (title: string) => {
    startTransition(() => {
      setSearchParams((old) => {
        old.set("title", title);
        return old;
      });
    });
  };

  return (
    <div className="flex gap-x-3">
      <DialogEditWorkspace />
      <div className="flex items-center gap-x-2">
        <div className="flex flex-1 items-center space-x-2">
          <SearchInput
            onChagneSearchParams={onChagneSearchParams}
            initialValue={initialTitle}
          />
          <PopoverFacetedFilter />
        </div>
      </div>
    </div>
  );
}
