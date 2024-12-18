import { useNavigate } from "@remix-run/react";

import { Button } from "@template/ui/components/button";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export function ForbiddenError() {
  const navigate = useNavigate();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">403</h1>
        <span className="font-medium">권한이 없습니다.</span>
        <p className="text-center text-muted-foreground">
          이 리소스를 보려면 <br /> 필요한 권한이 없습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            뒤로가기
          </Button>
          <Button onClick={() => navigate(PAGE_ENDPOINTS.ROOT)}>
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
