import React from "react";

export function TrashPopoverFooter() {
  return (
    <footer className="flex-shrink-0">
      <div className="mt-[1px] flex flex-col gap-[1px] bg-muted py-1 shadow-md">
        <div className="flex items-center justify-center px-2 py-1 text-muted-foreground">
          <div>휴지통에 30일 이상 보관된 페이지는 자동으로 삭제됩니다.</div>
        </div>
      </div>
    </footer>
  );
}
