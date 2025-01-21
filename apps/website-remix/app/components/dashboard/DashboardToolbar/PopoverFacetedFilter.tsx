import { startTransition } from "react";
import { useSearchParams } from "@remix-run/react";

import { Badge } from "@template/ui/components/badge";
import { Button } from "@template/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@template/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@template/ui/components/popover";
import { Separator } from "@template/ui/components/separator";
import { cn } from "@template/ui/lib";

import { Icons } from "~/components/icons";

interface Option {
  id: string;
  searchKey: string;
  label: string;
  value: string;
}

const options: Option[] = [
  {
    id: "1",
    searchKey: "favorites",
    label: "즐겨찾기",
    value: "true",
  },
  {
    id: "2",
    searchKey: "favorites",
    label: "즐겨찾기 안함",
    value: "false",
  },
];

export function PopoverFacetedFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const favorites = searchParams.getAll("favorites");
  const selectedValues = options.filter((option) =>
    favorites.includes(option.value),
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Icons.PlusCircle />
          즐겨찾기
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} 선택
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      selectedValues.find((v) => v.id === option.id),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="검색" />
          <CommandList>
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.find(
                  (v) => v.id === option.id,
                );
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      startTransition(() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams,
                        );
                        if (isSelected) {
                          newSearchParams.delete(
                            option.searchKey,
                            option.value,
                          );
                        } else {
                          newSearchParams.append(
                            option.searchKey,
                            option.value,
                          );
                        }
                        setSearchParams(newSearchParams);
                      });
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Icons.Check />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      startTransition(() => {
                        setSearchParams(new URLSearchParams());
                      });
                    }}
                    className="justify-center text-center"
                  >
                    초기화
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
