'use client';
import React from 'react';

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
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args) as ReturnType<T>;
    };
  }

  return memoizedFn.current;
}
