import { cachified } from "@epic-web/cachified";

import type { GetWorkspaceListParams } from "~/.server/data/workspace/list";
import { getWorkspaceList } from "~/.server/data/workspace/list";

const cache = new Map();

const WORKSPACE_LIST_CACHE_KEY = "workspace:list";

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
