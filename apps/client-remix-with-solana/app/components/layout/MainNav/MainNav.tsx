import { Link } from '@remix-run/react';

import { Icons } from '~/components/icons';
import { ButtonGroup } from '~/components/layout/ButtonGroup';
import { UserMenu } from '~/components/layout/UserMenu';
import { NAV_CONFIG, navigation } from '~/constants/navigation';

export default function MainNav() {
  return (
    <>
      <Link
        to={navigation.home}
        className="flex w-full items-center justify-center hover:scale-110 sm:block sm:w-auto"
      >
        <Icons.logo className="size-8" />
      </Link>

      <nav className="hidden gap-4 sm:flex lg:gap-6">
        {NAV_CONFIG.mainNav.map((item, index) => (
          <ButtonGroup
            key={`main-nav-${index.toString()}`}
            item={item}
            type="header"
          />
        ))}
      </nav>

      <nav>
        <UserMenu />
      </nav>
    </>
  );
}
