import { cachified } from "@epic-web/cachified";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class CacheService {
  private readonly cache = new Map();

  private readonly keys = {
    workspace: {
      list: "workspace:list",
    },
  };

  async getWorkspaceList<TFunction>(callback: () => Promise<TFunction>) {
    return cachified({
      ttl: 120_000,
      staleWhileRevalidate: 300_000,
      cache: this.cache,
      key: this.keys.workspace.list,
      async getFreshValue() {
        return await callback();
      },
    });
  }

  hardPurgeWorkspaceList() {
    try {
      this.cache.delete(this.keys.workspace.list);
    } catch (error) {
      console.error(error);
    }
  }
}
