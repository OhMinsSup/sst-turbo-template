import React from "react";

import { Input } from "@template/ui/components/input";

export function TrashPopoverSearhBar() {
  return (
    <div className="flex-shrink-0">
      <div className="my-3">
        <div className="flex min-h-7 w-full select-none items-center">
          <Input placeholder="휴지통에서 페이지 검색" />
        </div>
      </div>
    </div>
  );
}
