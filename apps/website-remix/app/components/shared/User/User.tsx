import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@template/ui/components/avatar";
import { Button } from "@template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@template/ui/components/dropdown-menu";

import type { RoutesActionData } from "~/.server/routes/auth/signout.action";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useUser } from "~/hooks/useUser";
import { useLoadingStore } from "~/store/useLoadingStore";
import { SelectTheme } from "./SelectTheme";

export default function User() {
  const user = useUser();

  const requestInfo = useRequestInfo();
  const fetcher = useFetcher<RoutesActionData>();
  const setLoadingState = useLoadingStore((state) => state.setLoadingState);

  const isActionSubmission = fetcher.state === "submitting";

  useEffect(() => {
    setLoadingState(isActionSubmission ? "loading" : "idle");
  }, [isActionSubmission]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={`@${user.name}`} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>프로필</DropdownMenuItem>
          <DropdownMenuItem>설정</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-between">
          테마
          <SelectTheme />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <fetcher.Form method="post" action="/signout" className="size-full">
            <input type="hidden" name="redirectTo" value={requestInfo.path} />
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start"
            >
              로그아웃
            </Button>
          </fetcher.Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
