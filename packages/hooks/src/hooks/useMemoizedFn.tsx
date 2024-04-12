'use client';

import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
type NoopHandler = (this: any, ...args: any[]) => any;

type PickFunction<T extends NoopHandler> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedFn<T extends NoopHandler>(fn: T) {
  const fnRef = React.useRef<T>(fn);

  fnRef.current = React.useMemo(() => fn, [fn]);

  const memoizedFn = React.useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    // eslint-disable-next-line func-names -- ignore
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args) as ReturnType<T>;
    };
  }

  return memoizedFn.current;
}
