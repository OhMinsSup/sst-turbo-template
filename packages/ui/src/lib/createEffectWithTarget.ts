"use client";

import type { DependencyList, EffectCallback } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { isBrowser } from "@veloss/assertion";

import type { BasicTarget } from "./dom";
import { useUnmount } from "../hooks/useUnmount";
import { depsAreSame } from "./depsAreSame";
import { depsEqual } from "./depsEqual";
import { getTargetElement } from "./dom";

const createEffectWithTarget = (
  useEffectType: typeof useEffect | typeof useLayoutEffect,
) => {
  const useEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | BasicTarget<any>[],
  ) => {
    const hasInitRef = useRef(false);

    const lastElementRef = useRef<(Element | null)[]>([]);
    const lastDepsRef = useRef<DependencyList>([]);

    const unLoadRef = useRef<any>();

    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets.map((item) => getTargetElement(item));

      // init run
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;

        unLoadRef.current = effect();
        return;
      }

      if (
        els.length !== lastElementRef.current.length ||
        !depsAreSame(els, lastElementRef.current) ||
        !depsAreSame(deps, lastDepsRef.current)
      ) {
        unLoadRef.current?.();

        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });

    useUnmount(() => {
      unLoadRef.current?.();
      // for react-refresh
      hasInitRef.current = false;
    });
  };

  return useEffectWithTarget;
};

export const useEffectWithTarget = createEffectWithTarget(useEffect);

export const useLayoutEffectWithTarget =
  createEffectWithTarget(useLayoutEffect);

export const useIsomorphicLayoutEffectWithTarget = isBrowser()
  ? useLayoutEffectWithTarget
  : useEffectWithTarget;

export const useDeepCompareEffectWithTarget = (
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget<any> | BasicTarget<any>[],
) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (!depsEqual(deps, ref.current)) {
    signalRef.current += 1;
  }
  ref.current = deps;

  useEffectWithTarget(effect, [signalRef.current], target);
};
