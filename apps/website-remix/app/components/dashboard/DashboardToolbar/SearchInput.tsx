import React, { useState } from "react";

import { Input } from "@template/ui/components/input";
import { useDebounceFn } from "@template/ui/hooks";

interface SearchInputProps {
  initialValue?: string | null;
  onChagneSearchParams: (title: string) => void;
}

export function SearchInput({
  onChagneSearchParams,
  initialValue,
}: SearchInputProps) {
  const [keyword, setKeyword] = useState(initialValue ?? "");

  const debouncedFn = useDebounceFn(
    (value: string) => {
      onChagneSearchParams(value);
    },
    {
      wait: 300,
    },
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setKeyword(title);
    debouncedFn.run(title);
  };

  return (
    <Input
      type="search"
      placeholder="검색"
      className="h-8 w-[150px] lg:w-[250px]"
      value={keyword}
      onChange={onChange}
    />
  );
}
