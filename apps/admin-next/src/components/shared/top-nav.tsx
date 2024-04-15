'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { CustomButton } from '@template/ui/custom-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@template/ui/dropdown-menu';
import { cn } from '@template/ui/utils';

import type { Navigation } from '~/services/store/useAdminNavigationStore';
import { Icons } from '~/components/icons';
import { useCheckActiveNav } from '~/services/hooks/useCheckActiveNav';
import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: Navigation[];
}

export default function TopNav({ className, links, ...props }: TopNavProps) {
  const { showTopNavigation } = useAdminConfigStore();
  const params = useParams();
  const { isActive } = useCheckActiveNav();
  return (
    <>
      {showTopNavigation ? (
        <>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CustomButton size="icon" variant="outline">
                  <Icons.menu />
                </CustomButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                {links.map(({ title, href, id }) => {
                  const to = typeof href === 'function' ? href(params) : href;
                  return (
                    <DropdownMenuItem key={`top-nav-dropdown-${id}`} asChild>
                      <Link
                        href={to}
                        className={cn({
                          'text-muted-foreground': isActive(to),
                        })}
                      >
                        {title}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav
            className={cn(
              'hidden items-center space-x-4 md:flex lg:space-x-6',
              className,
            )}
            {...props}
          >
            {links.map(({ title, href, id }) => {
              const to = typeof href === 'function' ? href(params) : href;
              return (
                <Link
                  key={`nav-link-${id}`}
                  href={to}
                  className={cn(
                    'hover:text-primary text-sm font-medium transition-colors',
                    {
                      'text-muted-foreground': isActive(to),
                    },
                  )}
                >
                  {title}
                </Link>
              );
            })}
          </nav>
        </>
      ) : null}
    </>
  );
}
