import { NavLink } from '@remix-run/react';

import { mainNavbuttonVariants, NavItem } from '~/constants/navigation';
import { useMainLinkActive } from '~/libs/hooks/useMainLinkActive';

interface ButtonLinkProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonLink({ item, type }: ButtonLinkProps) {
  const { href, Icon } = useMainLinkActive({ item });

  return (
    <NavLink
      to={item.disabled ? '#' : href}
      className={({ isActive, isPending, isTransitioning }) => {
        return mainNavbuttonVariants({
          item,
          type,
          isActive,
          isPending,
          isTransitioning,
        });
      }}
    >
      {Icon ? <Icon /> : <item.icon />}
    </NavLink>
  );
}
