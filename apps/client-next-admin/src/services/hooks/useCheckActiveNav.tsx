import { usePathname } from 'next/navigation';

import { useMemoizedFn } from '@template/react-hooks/useMemoizedFn';

export function useCheckActiveNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const pathArray = pathname.split('/').filter((item) => item !== '');
    const parsedHref = href.split('/').filter((item) => item !== '');

    if (href === '/' && pathArray.length < 1) return true;

    if (parsedHref.length > pathArray.length) return false;

    return parsedHref.every((item, index) => item === pathArray[index]);
  };

  return {
    isActive: useMemoizedFn(isActive),
  };
}
