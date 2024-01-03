'use client';
import React from 'react';
import { isBrowser } from '@template/react';

export function useIsHydrating(queryString: string) {
  // eslint-disable-next-line react/hook-use-state
  const [isHydrating] = React.useState(
    () => isBrowser && Boolean(document.querySelector(queryString)),
  );
  return isHydrating;
}
