/**
 * This file contains utilities for using client hints for user preference which
 * are needed by the server, but are only known by the browser.
 */
import { useEffect } from "react";
import { useRevalidator } from "@remix-run/react";
import { getHintUtils } from "@epic-web/client-hints";
import {
  clientHint as colorSchemeHint,
  subscribeToSchemeChange,
} from "@epic-web/client-hints/color-scheme";
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone";

import { SESSION_DATA_KEY } from "~/constants/constants";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import {
  clientHint as deviceHint,
  subscribeToDeviceChange,
} from "./device-type";

const hintsUtils = getHintUtils({
  theme: {
    ...colorSchemeHint,
    cookieName: SESSION_DATA_KEY.themeKey,
  },
  timeZone: {
    ...timeZoneHint,
    cookieName: SESSION_DATA_KEY.timezoneKey,
  },
  device: deviceHint,
});

export const { getHints } = hintsUtils;

/**
 * @returns an object with the client hints and their values
 */
export function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}

/**
 * @returns inline script element that checks for client hints and sets cookies
 * if they are not set then reloads the page if any cookie was set to an
 * inaccurate value.
 */
export function ClientHintCheck() {
  const { revalidate } = useRevalidator();
  useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate]);

  useEffect(() => subscribeToDeviceChange(() => revalidate()), [revalidate]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
}
