export type Dict<T = unknown> = Record<string, T>;

// Number assertions
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isNotNumber(value: unknown) {
  return typeof value !== 'number' || isNaN(value) || !isFinite(value);
}

export function isNumeric(value: unknown) {
  if (isNullOrUndefined(value)) return false;
  if (isNotNumber(value)) return false;
  if (!isString(value)) return false;
  return Number(value) - parseFloat(value) + 1 >= 0;
}

// Array assertions
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isEmptyArray(value: unknown) {
  return isArray(value) && value.length === 0;
}

// eslint-disable-next-line @typescript-eslint/ban-types -- Function is a valid type
export function isFunction<T extends Function = Function>(
  value: unknown,
): value is T {
  return typeof value === 'function';
}

// Generic assertions
export function isDefined(value: unknown) {
  return typeof value !== 'undefined';
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

// Object assertions
export function isObject(value: unknown): value is Dict {
  const type = typeof value;
  return (
    value !== null &&
    (type === 'object' || type === 'function') &&
    !isArray(value)
  );
}

export function isEmptyObject(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isNotEmptyObject(value: unknown): value is object {
  return Boolean(value) && !isEmptyObject(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

// String assertions
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// Empty assertions
export function isEmpty(value: unknown): boolean {
  if (isArray(value)) return isEmptyArray(value);
  if (isObject(value)) return isEmptyObject(value);
  if (value === null || value === '') return true;
  return false;
}

export function compact<T>(array: T[]): T[] {
  return array.filter(Boolean);
}

export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value === null;
