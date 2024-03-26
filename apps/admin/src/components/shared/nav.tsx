import React, { Fragment, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@template/ui/collapsible';
import { CustomButton, customButtonVariants } from '@template/ui/custom-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@template/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@template/ui/tooltip';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';
import { useCheckActiveNav } from '~/services/hooks/useCheckActiveNav';
import { type Navigation } from '~/services/store/useAdminNavigationStore';

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  links: Navigation[];
  closeNav: () => void;
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
}: NavProps) {
  const renderLink = useCallback(
    ({ sub, ...rest }: Navigation) => {
      if (isCollapsed && sub.length > 0) {
        return <NavLinkIconDropdown {...rest} sub={sub} closeNav={closeNav} />;
      }

      if (isCollapsed) {
        return <NavLinkIcon {...rest} closeNav={closeNav} sub={[]} />;
      }

      if (sub.length > 0) {
        return <NavLinkDropdown {...rest} sub={sub} closeNav={closeNav} />;
      }

      return <NavLink {...rest} closeNav={closeNav} sub={[]} />;
    },
    [closeNav, isCollapsed],
  );

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'bg-background group border-b py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none',
        className,
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((target) => {
            return (
              <React.Fragment key={`nav-root-${target.id}`}>
                {renderLink(target)}
              </React.Fragment>
            );
          })}
        </nav>
      </TooltipProvider>
    </div>
  );
}

interface NavLinkProps extends Navigation {
  subLink?: boolean;
  closeNav: () => void;
}

function NavLink({
  title,
  icon,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { isActive } = useCheckActiveNav();
  const params = useParams();
  const IconComponent = icon ? Icons[icon] : Fragment;
  const to = typeof href === 'function' ? href(params) : href;

  return (
    <Link
      href={to}
      onClick={closeNav}
      className={cn(
        customButtonVariants({
          variant: isActive(to) ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-12 justify-start text-wrap rounded-none px-6',
        subLink && 'h-10 w-full border-l border-l-slate-500 px-2',
      )}
      aria-current={isActive(to) ? 'page' : undefined}
    >
      <div className="mr-2">
        <IconComponent className="size-4" />
      </div>
      {title}
    </Link>
  );
}

function NavLinkDropdown({ title, icon, sub, closeNav }: NavLinkProps) {
  const { isActive } = useCheckActiveNav();
  const params = useParams();

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = Boolean(
    sub.find((s) =>
      isActive(typeof s.href === 'function' ? s.href(params) : s.href),
    ),
  );

  const IconComponent = icon ? Icons[icon] : Fragment;

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          customButtonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-12 w-full justify-start rounded-none px-6',
        )}
      >
        <div className="mr-2">
          <IconComponent className="size-4" />
        </div>
        {title}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180',
          )}
        >
          <Icons.chevronLeft
            className="size-5 -rotate-90"
            stroke="currentColor"
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsibleDropdown" asChild>
        <ul>
          {sub.map((sublink) => (
            <li key={`collapsible-${sublink.id}`} className="my-1 ml-8">
              <NavLink {...sublink} subLink closeNav={closeNav} sub={[]} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkIcon({ title, icon, href }: NavLinkProps) {
  const { isActive } = useCheckActiveNav();
  const params = useParams();

  const IconComponent = icon ? Icons[icon] : Fragment;
  const to = typeof href === 'function' ? href(params) : href;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={to}
          className={cn(
            customButtonVariants({
              variant: isActive(to) ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-12 w-12',
          )}
        >
          <IconComponent className="size-6" />
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {title}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({ title, icon, sub }: NavLinkProps) {
  const { isActive } = useCheckActiveNav();
  const params = useParams();

  const isChildActive = Boolean(
    sub.find((s) => {
      return isActive(typeof s.href === 'function' ? s.href(params) : s.href);
    }),
  );

  const IconComponent = icon ? Icons[icon] : Fragment;

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <CustomButton
              variant={isChildActive ? 'secondary' : 'ghost'}
              size="icon"
              className="h-12 w-12"
            >
              <IconComponent className="size-4" />
            </CustomButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {title}
          <Icons.chevronDown className="text-muted-foreground size-5 -rotate-90" />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" align="start" sideOffset={4}>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub.map((target) => {
          const SubIcon = target.icon ? Icons[target.icon] : Fragment;
          const to =
            typeof target.href === 'function'
              ? target.href(params)
              : target.href;
          return (
            <DropdownMenuItem key={`navlink-${target.id}`} asChild>
              <Link href={to} className={isActive(to) ? 'bg-secondary' : ''}>
                <SubIcon className="size-4" />
                <span className="ml-2 max-w-52 text-wrap">{target.title}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
