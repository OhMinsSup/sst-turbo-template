import type { Params } from "@remix-run/react";
import { useMemo } from "react";
import { useLocation } from "@remix-run/react";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@template/ui/components/breadcrumb";
import { isFunction } from "@template/utils/assertion";

import type { BaseBreadcrumbItem } from "~/providers/breadcrumb.utils";

interface RecursiveBreadcrumbItemProps {
  item: BaseBreadcrumbItem;
  parentIndex?: number;
  searchParams?: Readonly<Params<string>>;
}

export function RecursiveBreadcrumbItem({
  item,
  searchParams,
  parentIndex = 0,
}: RecursiveBreadcrumbItemProps) {
  const location = useLocation();
  const pathname = isFunction(item.pathname)
    ? item.pathname(searchParams)
    : item.pathname;

  const isLastMatch = useMemo(
    () => item.isLast && pathname === location.pathname,
    [item.isLast, location.pathname, pathname],
  );

  const isLastNotMatch = useMemo(
    () => item.isLast && pathname !== location.pathname,
    [item.isLast, location.pathname, pathname],
  );

  return (
    <>
      {isLastMatch ? (
        <BreadcrumbItem>
          <BreadcrumbPage>{item.title}</BreadcrumbPage>
        </BreadcrumbItem>
      ) : (
        <>
          {isLastNotMatch ? null : (
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={pathname}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </>
      )}
      {typeof item.children !== "undefined" && item.children.length > 0 ? (
        <>
          <BreadcrumbSeparator className="hidden md:block" />
          {item.children.map((child, index) => {
            return (
              <RecursiveBreadcrumbItem
                key={`recursive:breadcumb${parentIndex}:${index}`}
                item={child}
                parentIndex={index}
                searchParams={searchParams}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
}
