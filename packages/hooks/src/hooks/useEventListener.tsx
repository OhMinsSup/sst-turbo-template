'use client';

import type { BasicTarget } from '@template/react';
import { getTargetElement } from '@template/react';

import { useEffectWithTarget } from './createEffectWithTarget';
import { useLatest } from './useLatest';

type NoopHandler = (...p: any) => void;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

interface Options<T extends Target = Target> {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

// @ts-expect-error useEventListener type
function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void;
// @ts-expect-error useEventListener type
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): void;
// @ts-expect-error useEventListener type
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): void;
// @ts-expect-error useEventListener type
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void;
// @ts-expect-error useEventListener type
function useEventListener(
  eventName: string,
  handler: NoopHandler,
  options: Options,
): void;

export function useEventListener(
  eventName: string,
  handler: NoopHandler,
  options: Options = {},
) {
  const handlerRef = useLatest(handler);

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(options.target, window);
      if (!targetElement?.addEventListener) {
        return;
      }

      const eventListener = (event: Event) => {
        handlerRef.current(event);
      };

      targetElement.addEventListener(eventName, eventListener, {
        capture: options.capture,
        once: options.once,
        passive: options.passive,
      });

      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture,
        });
      };
    },
    [eventName, options.capture, options.once, options.passive],
    options.target,
  );
}
