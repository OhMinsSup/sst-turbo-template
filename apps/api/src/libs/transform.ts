import type { TransformOptions } from "class-transformer";
import { Transform } from "class-transformer";

const valueToBoolean = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (["true", "on", "yes", "1"].includes(value.toLowerCase())) {
      return true;
    }
    if (["false", "off", "no", "0"].includes(value.toLowerCase())) {
      return false;
    }
  }
  return undefined;
};

export const ToBoolean = (options?: TransformOptions) => {
  const toPlain = Transform(
    ({ value }) => {
      return value as unknown;
    },
    {
      ...options,
      toPlainOnly: true,
    },
  );
  const toClass = (target: unknown, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: unknown, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

export const ToStringBooleanArray = (options?: TransformOptions) => {
  const toPlain = Transform(
    ({ value }) => {
      return value as unknown;
    },
    {
      ...options,
      toPlainOnly: true,
    },
  );
  const toClass = (target: unknown, key: string) => {
    return Transform(
      ({ obj }) => {
        const value = obj[key];
        if (Array.isArray(value)) {
          return value.map((v) => valueToBoolean(v));
        } else if (typeof value === "string") {
          return [valueToBoolean(value)];
        }
        return [];
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: unknown, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};
