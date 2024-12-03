import { cachified } from "@epic-web/cachified";

import type { GetWorkspaceListParams } from "../data/workspace";
import { getWorkspaceList } from "../data/workspace";

const cache = new Map();

const WORKSPACE_LIST_CACHE_KEY = "workspace:list";

// Path: apps/website-remix/app/.server/routes/dashboard/dashboard.[action|loader].ts - cache

export function getCacheWorkspaceList({
  session,
  query,
}: GetWorkspaceListParams) {
  return cachified({
    ttl: 120_000 /* Two minutes */,
    staleWhileRevalidate: 300_000 /* Five minutes */,
    cache,
    key: WORKSPACE_LIST_CACHE_KEY,
    async getFreshValue() {
      return await getWorkspaceList({ session, query });
    },
  });
}

export function hardPurgeWorkspaceList() {
  try {
    cache.delete(WORKSPACE_LIST_CACHE_KEY);
  } catch (error) {
    console.error(error);
  }
}
