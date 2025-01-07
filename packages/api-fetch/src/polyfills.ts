type GlobalThis = typeof globalThis;

/**
 * @description globalThis를 polyfill합니다.
 * https://mathiasbynens.be/notes/globalthis
 */
export function polyfillGlobalThis() {
  if (typeof globalThis === "object") return;
  try {
    Object.defineProperty(Object.prototype, "__magic_fetch__", {
      get: function () {
        return this as GlobalThis;
      },
      configurable: true,
    });
    // @ts-expect-error 'Allow access to magic'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    __magic_fetch__.globalThis = __magic_fetch__;
    // @ts-expect-error 'Allow access to magic'
    delete Object.prototype.__magic_fetch__;
  } catch {
    if (typeof self !== "undefined") {
      // @ts-expect-error 'Allow access to globals'
      self.globalThis = self;
    }
  }
}
