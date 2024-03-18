'use client';

import React from 'react';

import { isBrowser } from '@template/react';

export function useIsHydrating(queryString: string) {
  const isHydrating = React.useMemo(
    () => () => isBrowser && Boolean(document.querySelector(queryString)),
    [queryString],
  );
  return isHydrating;
}
