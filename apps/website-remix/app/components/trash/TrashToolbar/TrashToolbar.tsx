import { useTransition } from "react";
import { useSearchParams } from "@remix-run/react";

import { SearchInput } from "~/components/dashboard/DashboardToolbar/SearchInput";

export default function TrashToolbar() {
  const [, startTransition] = useTransition();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTitle = searchParams.get("title") ?? "";

  const onChagneSearchParams = (title: string) => {
    startTransition(() => {
      setSearchParams((old) => {
        if (title === "") {
          old.delete("title");
          return old;
        }
        old.set("title", title);
        return old;
      });
    });
  };

  return (
    <div className="flex gap-x-3">
      <div className="flex items-center gap-x-2">
        <div className="flex flex-1 items-center space-x-2">
          <SearchInput
            onChagneSearchParams={onChagneSearchParams}
            initialValue={initialTitle}
          />
        </div>
      </div>
    </div>
  );
}
