import { useNavigate } from "@remix-run/react";

import { Button } from "@template/ui/components/button";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export function NotFoundError() {
  const navigate = useNavigate();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">페이지를 찾을 수 없습니다.</span>
        <p className="text-center text-muted-foreground">
          찾으시는 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
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
