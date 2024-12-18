import { Button } from "@template/ui/components/button";

export function MaintenanceError() {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">503</h1>
        <span className="font-medium">웹사이트가 유지 관리 중입니다.</span>
        <p className="text-center text-muted-foreground">
          현재 사이트를 이용할 수 없습니다. <br />곧 다시 접속하겠습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline">Learn more</Button>
        </div>
      </div>
    </div>
  );
}
