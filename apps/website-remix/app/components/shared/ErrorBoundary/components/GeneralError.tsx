import { useNavigate } from "@remix-run/react";

import { Button } from "@template/ui/components/button";
import { cn } from "@template/ui/lib";

import { PAGE_ENDPOINTS } from "~/constants/constants";

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate();
  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] font-bold leading-tight">500</h1>
        )}
        <span className="font-medium">
          서버에서 오류가 발생했습니다.
          {`:')`}
        </span>
        <p className="text-center text-muted-foreground">
          불편을 끼쳐드려 죄송합니다. <br /> 나중에 다시 시도해 주세요.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              뒤로가기
            </Button>
            <Button onClick={() => navigate(PAGE_ENDPOINTS.ROOT)}>
              홈으로 이동
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
