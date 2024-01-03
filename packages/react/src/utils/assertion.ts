export function isRefObject(val: any): val is { current: any } {
  return 'current' in val;
}

export function isElement(el: any): el is Element {
  return (
    el !== null &&
    typeof el === 'object' &&
    'nodeType' in el &&
    (el as Element).nodeType === Node.ELEMENT_NODE
  );
}

export function isHTMLElement(el: any): el is HTMLElement {
  if (!isElement(el)) {
    return false;
  }

  const win = el.ownerDocument.defaultView ?? window;
  return el instanceof win.HTMLElement;
}

export function canUseDOM(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if ('document' in window && 'createElement' in window.document) {
    return true;
  }

  return false;
}

export const isBrowser = canUseDOM();
