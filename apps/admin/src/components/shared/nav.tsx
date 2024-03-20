import Link from 'next/link';

import {
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CustomButton,
  customButtonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@template/ui';

import type { Navigation } from '~/constants/navigations';
import { Icons } from '~/components/icons';
import { navigations } from '~/constants/navigations';

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
  const renderLink = ({ sub, ...rest }: Navigation) => {
    const key = `${rest.title}-${rest.href}`;
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      );

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

    // if (sub)
    //   return (
    //     <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
    //   );

    return <NavLink {...rest} key={key} closeNav={closeNav} />;
  };

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
          {links.map(renderLink)}
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
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  //   const { checkActiveNav } = useCheckActiveNav();
  return (
    <Link
      href={href}
      onClick={closeNav}
      className={cn(
        customButtonVariants({
          //   variant: checkActiveNav(href) ? 'secondary' : 'ghost',
          variant: 'ghost',
          size: 'sm',
        }),
        'h-12 justify-start text-wrap rounded-none px-6',
        subLink && 'h-10 w-full border-l border-l-slate-500 px-2',
      )}
      //   aria-current={checkActiveNav(href) ? 'page' : undefined}
    >
      <div className="mr-2">{icon}</div>
      {title}
      {label ? (
        <div className="bg-primary text-primary-foreground ml-2 rounded-lg px-1 text-[0.625rem]">
          {label}
        </div>
      ) : null}
    </Link>
  );
}

// function NavLinkDropdown({ title, icon, label, sub, closeNav }: NavLinkProps) {
//   //   const { checkActiveNav } = useCheckActiveNav();

//   /* Open collapsible by default
//    * if one of child element is active */
//   //   const isChildActive = Boolean(sub?.find((s) => checkActiveNav(s.href)));

//   return (
//     <Collapsible defaultOpen={false}>
//       <CollapsibleTrigger
//         className={cn(
//           customButtonVariants({ variant: 'ghost', size: 'sm' }),
//           'group h-12 w-full justify-start rounded-none px-6',
//         )}
//       >
//         <div className="mr-2">{icon}</div>
//         {title}
//         {label ? (
//           <div className="bg-primary text-primary-foreground ml-2 rounded-lg px-1 text-[0.625rem]">
//             {label}
//           </div>
//         ) : null}
//         <span
//           className={cn(
//             'ml-auto transition-all group-data-[state="open"]:-rotate-180',
//           )}
//         >
//           <Icons.chevronDown className="size-4 -rotate-90" stroke="1" />
//         </span>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="collapsibleDropdown" asChild>
//         <ul>
//           {sub?.map((sublink) => (
//             <li key={sublink.title} className="my-1 ml-8">
//               <NavLink {...sublink} subLink closeNav={closeNav} />
//             </li>
//           ))}
//         </ul>
//       </CollapsibleContent>
//     </Collapsible>
//   );
// }

function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
  //   const { checkActiveNav } = useCheckActiveNav();
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            customButtonVariants({
              //   variant: checkActiveNav(href) ? 'secondary' : 'ghost',
              variant: 'ghost',
              size: 'icon',
            }),
            'h-12 w-12',
          )}
        >
          {icon}
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {title}
        {label ? (
          <span className="text-muted-foreground ml-auto">{label}</span>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
  //   const { checkActiveNav } = useCheckActiveNav();

  /* Open collapsible by default
   * if one of child element is active */
  //   const isChildActive = Boolean(sub?.find((s) => checkActiveNav(s.href)));

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <CustomButton
              //   variant={isChildActive ? 'secondary' : 'ghost'}
              variant="ghost"
              size="icon"
              className="h-12 w-12"
            >
              {icon}
            </CustomButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {title}{' '}
          {label ? (
            <span className="text-muted-foreground ml-auto">{label}</span>
          ) : null}
          <Icons.chevronDown className="text-muted-foreground size-4 -rotate-90" />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" align="start" sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              href={href}
              className={checkActiveNav(href) ? 'bg-secondary' : ''}
            >
              {icon} <span className="ml-2 max-w-52 text-wrap">{title}</span>
              {label ? <span className="ml-auto text-xs">{label}</span> : null}
            </Link>
          </DropdownMenuItem>
        ))} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
