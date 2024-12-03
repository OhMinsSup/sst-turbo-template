import { cachified } from "@epic-web/cachified";

import type { GetWorkspaceListParams } from "../data/workspace";
import { getWorkspaceList } from "../data/workspace";

const cache = new Map();

// Path: apps/website-remix/app/.server/routes/dashboard/dashboard.[action|loader].ts - cache

export function getCacheWorkspaceList({
  session,
  query,
  queryHashKey,
}: GetWorkspaceListParams & {
  queryHashKey: string;
}) {
  return cachified({
    ttl: 120_000 /* Two minutes */,
    staleWhileRevalidate: 300_000 /* Five minutes */,
    cache,
    key: `workspace:list:${queryHashKey}`,
    async getFreshValue() {
      return await getWorkspaceList({ session, query });
    },
  });
}

export function hardPurgeWorkspaceList(queryHashKey: string) {
  try {
    cache.delete(`workspace:list:${queryHashKey}`);
  } catch (error) {
    console.error(error);
  }
}
