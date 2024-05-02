export type Dict<T = unknown> = Record<string, T>;

// Number assertions
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isNotNumber(value: unknown) {
  return (
    typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)
  );
}

export function isEmptyArray(value: unknown) {
  return Array.isArray(value) && value.length === 0;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function = Function>(
  value: unknown
): value is T {
  return typeof value === "function";
}

// Generic assertions
export function isDefined(value: unknown) {
  return typeof value !== "undefined";
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

// Object assertions
export function isObject(value: unknown): value is Dict {
  const type = typeof value;
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
}

export function isEmptyObject(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isNotEmptyObject(value: unknown): value is object {
  return !isEmptyObject(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

// String assertions
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

// Empty assertions
export function isEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return isEmptyArray(value);
  if (isObject(value)) return isEmptyObject(value);
  if (value == null || value === "" || typeof value === "undefined") {
    return true;
  }
  return false;
}

export function isElement(el: unknown): el is Element {
  return (
    el != null &&
    typeof el == "object" &&
    "nodeType" in el &&
    el.nodeType === Node.ELEMENT_NODE
  );
}

export function isHTMLElement(el: unknown): el is HTMLElement {
  if (!isElement(el)) {
    return false;
  }

  const win = el.ownerDocument.defaultView ?? window;
  return el instanceof win.HTMLElement;
}

export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value === null;
