import { useState, useTransition } from "react";

import { useDebounceFn } from "@template/ui/hooks";

import { useTrashProvider } from "../context/trash";
import { TrashPopoverScrollArea } from "./TrashPopoverScrollArea";
import { TrashPopoverSearhBar } from "./TrashPopoverSearhBar";

export function TrashPopoverContent() {
  const { searchKeyword, changeSearchKeyword } = useTrashProvider();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchKeyword);

  const { run: debounceRun } = useDebounceFn(
    (keyword: string) => {
      setValue(keyword);
      startTransition(() => {
        changeSearchKeyword(keyword);
      });
    },
    {
      wait: 300,
    },
  );

  const onChagneSearchParams = (keyword: string) => {
    setValue(keyword);
    debounceRun(keyword);
  };

  return (
    <div
      className="flex h-[50vh] max-h-[70vh] w-[414px] min-w-[180px] flex-col p-4"
      style={{ maxWidth: "calc(-24px + 100vw)" }}
    >
      <TrashPopoverSearhBar
        value={value}
        onChagneSearchParams={onChagneSearchParams}
      />
      <TrashPopoverScrollArea
        deferredQuery={searchKeyword}
        isPending={isPending}
      />
    </div>
  );
}
