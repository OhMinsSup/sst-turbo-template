import Link from 'next/link';

import { CustomButton } from '@template/ui/custom-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@template/ui/dropdown-menu';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    isActive: boolean;
  }[];
}

export default function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CustomButton size="icon" variant="outline">
              <Icons.menu />
            </CustomButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href, isActive }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  href={href}
                  className={cn({
                    'text-muted-foreground': !isActive,
                  })}
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
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
        {links.map(({ title, href, isActive }) => (
          <Link
            key={`${title}-${href}`}
            href={href}
            className={cn(
              'hover:text-primary text-sm font-medium transition-colors',
              {
                'text-muted-foreground': !isActive,
              },
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  );
}
