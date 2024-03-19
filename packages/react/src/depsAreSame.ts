import type React from 'react';

export function depsAreSame(
  oldDeps: React.DependencyList,
  deps: React.DependencyList,
): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}
