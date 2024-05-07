import { NavLink } from '@remix-run/react';

import {
  mainNavbuttonVariants,
  navigation,
  NavItem,
} from '~/constants/navigation';
import { useOptionalUser } from '~/libs/hooks/useUser';

interface ButtonMyPageProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonMyPage({ item, type }: ButtonMyPageProps) {
  const data = useOptionalUser();
  const href = data ? navigation.user.id(data.id.toString()) : '#';

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
      <item.icon />
    </NavLink>
  );
}
