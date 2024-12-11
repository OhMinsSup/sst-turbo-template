import { useFetcher } from "@remix-run/react";

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

import type { RoutesActionData } from "~/.server/routes/auth/actions/signout.action";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useUser } from "~/hooks/useUser";
import { SelectTheme } from "./SelectTheme";
import { UserImage } from "./UserImage";

export default function User() {
  const user = useUser();

  const requestInfo = useRequestInfo();
  const fetcher = useFetcher<RoutesActionData>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserImage className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
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
