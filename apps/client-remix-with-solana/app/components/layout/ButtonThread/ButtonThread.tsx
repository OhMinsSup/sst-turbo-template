import { useCallback } from 'react';

import { cn } from '@template/ui/utils';

import { mainNavbuttonVariants, NavItem } from '~/constants/navigation';
import { useMainLinkActive } from '~/libs/hooks/useMainLinkActive';
import { useNavigateThreanForm } from '~/libs/hooks/useNavigateThreanForm';

interface ButtonThreadProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonThread({ item, type }: ButtonThreadProps) {
  const { isActive, href } = useMainLinkActive({ item });

  const { handleHref } = useNavigateThreanForm();

  const onClick = useCallback(() => {
    handleHref();
  }, [handleHref]);

  return (
    <button
      type="button"
      role="link"
      data-href={item.disabled ? '#' : href}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        mainNavbuttonVariants({
          item,
          type,
          isActive,
          isPending: false,
          isTransitioning: false,
        }),
      )}
      onClick={onClick}
    >
      <item.icon />
    </button>
  );
}
