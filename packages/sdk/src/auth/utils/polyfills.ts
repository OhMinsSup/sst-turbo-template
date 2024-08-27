type GlobalThis = typeof globalThis;

// ref: https://mathiasbynens.be/notes/globalthis
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  return {};
}

const _global = getGlobal() as GlobalThis;

try {
  const _defineOpts: PropertyDescriptor = { enumerable: false, value: _global };
  Object.defineProperties(_global, {
    self: _defineOpts,
    window: _defineOpts,
    global: _defineOpts,
  });
} catch {
  /* empty */
}

export default _global;
