import { type ClientHint } from "@epic-web/client-hints";

import { SESSION_DATA_KEY } from "~/constants/constants";

export const clientHint = {
  cookieName: SESSION_DATA_KEY.deviceKey,
  getValueCode: `
    const mediaQueryList = window.matchMedia('max-width: 768px');
    return mediaQueryList.matches ? 'mobile' : 'desktop';
  `,
  fallback: "desktop",
  transform(value) {
    return value === "mobile" ? "mobile" : "desktop";
  },
} as const satisfies ClientHint<"desktop" | "mobile">;

export function subscribeToDeviceChange(
  subscriber: (value: "desktop" | "mobile") => void,
  cookieName: string = clientHint.cookieName,
) {
  const schemaMatch = window.matchMedia("(max-width: 768px)");
  function handleThemeChange() {
    const value = schemaMatch.matches ? "mobile" : "desktop";
    document.cookie = `${cookieName}=${value}; Max-Age=31536000; Path=/`;
    subscriber(value);
  }
  schemaMatch.addEventListener("change", handleThemeChange);
  return function cleanupSchemaChange() {
    schemaMatch.removeEventListener("change", handleThemeChange);
  };
}
