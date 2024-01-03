'use client';
import React from 'react';
import { useLatest } from './useLatest';

export const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn);

  React.useEffect(
    () => () => {
      fnRef.current();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
