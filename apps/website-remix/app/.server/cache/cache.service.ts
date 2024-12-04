import type { GetFreshValueContext } from "@epic-web/cachified";
import { cachified } from "@epic-web/cachified";
import { container, injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class CacheService {
  private readonly cache = new Map();

  private readonly keys = {
    workspace: {
      list: "workspace:list",
    },
  };

  async getWorkspaceList<TFunction>(
    callback: (context: GetFreshValueContext) => Promise<TFunction>,
    forceFresh?: boolean,
  ) {
    return cachified({
      ttl: 60_000 /* Default cache of one minute... */,
      forceFresh,
      cache: this.cache,
      key: this.keys.workspace.list,
      async getFreshValue(context) {
        return await callback(context);
      },
    });
  }

  clearWorkspaceList() {
    this.cache.delete(this.keys.workspace.list);
  }
}

const token = CacheService.name;

container.register<CacheService>(token, { useClass: CacheService });
