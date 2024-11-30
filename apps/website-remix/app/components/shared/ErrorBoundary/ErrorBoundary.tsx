import type { ErrorResponse } from "@remix-run/react";
import {
  isRouteErrorResponse,
  Link,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { buttonVariants } from "@template/ui/components/button";
import { cn } from "@template/ui/lib";

import { PAGE_ENDPOINTS, SITE_CONFIG } from "~/constants/constants";
import { getErrorMessage } from "~/libs/error";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

export default function ErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <>
      <img
        alt="not found"
        loading="lazy"
        width="300"
        height="300"
        decoding="async"
        data-nimg="1"
        src={SITE_CONFIG[404]}
      />
      <div className="mx-auto mt-12 w-full max-w-[546px]">
        <h4 className="mb-4 text-primary">
          {error.status} {getErrorMessage(error.data)}
        </h4>
        <div className="mb-10 text-base font-normal dark:text-white">
          찾으시는 페이지는 이름이 변경되어 <br />
          삭제되었거나 일시적으로 사용할 수 없는 것 같습니다.
        </div>
      </div>
      <div className="mx-auto w-full max-w-[300px]">
        <Link
          viewTransition
          className={cn(
            buttonVariants({
              variant: "link",
            }),
          )}
          to={PAGE_ENDPOINTS.ROOT}
        >
          홈으로 이동
        </Link>
      </div>
    </>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => (
    <>
      <img
        alt="unexpected error"
        loading="lazy"
        width="300"
        height="300"
        decoding="async"
        data-nimg="1"
        src={SITE_CONFIG[500]}
      />
      <div className="mx-auto mt-12 w-full max-w-[546px]">
        <h4 className="mb-4 text-zinc-900">{getErrorMessage(error)}</h4>
        <div className="mb-10 text-base font-normal dark:text-white">
          죄송합니다. 예기치 않은 오류가 발생했습니다. <br />
          잠시 후 다시 시도해주세요.
        </div>
      </div>
      <div className="mx-auto w-full max-w-[300px]">
        <Link
          viewTransition
          className={cn(
            buttonVariants({
              variant: "link",
            }),
          )}
          to={PAGE_ENDPOINTS.ROOT}
        >
          홈으로 이동
        </Link>
      </div>
    </>
  ),
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== "undefined") {
    console.error(error);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-20 text-center">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  );
}
