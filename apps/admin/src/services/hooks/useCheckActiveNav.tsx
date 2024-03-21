import { usePathname } from 'next/navigation';

import { useMemoizedFn } from '@template/react-hooks';

export function useCheckActiveNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const pathArray = pathname.split('/').filter((item) => item !== '');

    if (href === '/' && pathArray.length < 1) return true;

    return pathArray.includes(href.replace(/^\//, ''));
  };

  return {
    isActive: useMemoizedFn(isActive),
  };
}
