import React from "react";

import { Input } from "@template/ui/components/input";

interface TrashPopoverSearhBarProps {
  value: string;
  onChagneSearchParams: (keyword: string) => void;
}

export function TrashPopoverSearhBar({
  value,
  onChagneSearchParams,
}: TrashPopoverSearhBarProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChagneSearchParams(e.target.value);
  };

  return (
    <div className="flex-shrink-0">
      <div className="my-3">
        <div className="flex min-h-7 w-full select-none items-center">
          <Input
            type="search"
            placeholder="휴지통에서 페이지 검색"
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
