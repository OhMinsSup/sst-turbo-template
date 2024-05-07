import { useCallback, useState } from 'react';
import { Form, Link } from '@remix-run/react';

import { Button, buttonVariants } from '@template/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@template/ui/dropdown-menu';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';
import { navigation } from '~/constants/navigation';
import { Theme, useTheme } from '~/context/useThemeContext';
import { getPath } from '~/routes/api.v1.auth.logout';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useTheme();

  const onChaneTheme = useCallback(() => {
    setTheme((previousTheme) =>
      previousTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK,
    );
  }, [setTheme]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'hover:text-foreground leading-tight',
          open ? 'text-foreground' : 'text-foreground/60',
        )}
      >
        <Icons.alignLeft />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={20}>
        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start space-x-2 p-0"
            variant="ghost"
            onClick={onChaneTheme}
            size="sm"
          >
            {theme === Theme.DARK ? <Icons.sun /> : <Icons.moon />}
            <span>
              {theme === Theme.DARK ? '라이트 모드로 전환' : '다크 모드로 전환'}
            </span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start p-0"
            variant="ghost"
            size="sm"
          >
            설정
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to={navigation.saved}
            unstable_viewTransition
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'sm',
              }),
              'h-auto w-full justify-start p-0',
            )}
          >
            저장됨
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to={navigation.liked}
            unstable_viewTransition
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'sm',
              }),
              'h-auto w-full justify-start p-0',
            )}
          >
            좋아요
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Form action={getPath()} method="post">
            <Button
              type="submit"
              className="h-auto w-full justify-start space-x-2 p-0"
              variant="ghost"
              size="sm"
            >
              <span>로그아웃</span>
            </Button>
          </Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
