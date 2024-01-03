'use client';
import type React from 'react';
import { isBrowser, isElement } from './assertion';

export function getOwnerWindow(node?: Element | null): typeof globalThis {
  return isElement(node)
    ? getOwnerDocument(node).defaultView ?? window
    : window;
}

export function getOwnerDocument(node?: Element | null): Document {
  if (isElement(node)) {
    if ('ownerDocument' in node) {
      return node.ownerDocument;
    }
    return document;
  }
  return document;
}

export const IS_APPLE: boolean = isBrowser
  ? /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  : false;

export const getScrollTop = (el: Document | Element) => {
  if (el === document || el === document.body) {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop,
    );
  }
  return (el as Element).scrollTop;
};

export const getScrollHeight = (el: Document | Element) => {
  return (
    (el as Element).scrollHeight ||
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  );
};

export const getClientHeight = (el: Document | Element) => {
  return (
    (el as Element).clientHeight ||
    Math.max(document.documentElement.clientHeight, document.body.clientHeight)
  );
};

export const getWindowScrollTop = () => {
  if (!isBrowser) {
    return 0;
  }

  if ('documentElement' in document) {
    return (
      window.document.documentElement.scrollTop ||
      window.document.body.scrollTop
    );
  }

  return window.document.body.scrollTop;
};

type TargetValue<T> = T | undefined | null;

type TargetType = HTMLElement | Element | Window | Document;

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | React.MutableRefObject<TargetValue<T>>;

export function getTargetElement<T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T,
) {
  if (!isBrowser) {
    return undefined;
  }

  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetValue<T>;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
