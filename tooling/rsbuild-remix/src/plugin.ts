import type { RsbuildPlugin } from '@rsbuild/core';

const REMIX_PLUGIN_NAME = 'rsbuild:remix';

export interface RemixRsbuildPluginOptions {}

export function remixRsbuildPlugin(
  options: RemixRsbuildPluginOptions = {},
): RsbuildPlugin {
  return {
    name: REMIX_PLUGIN_NAME,
    setup(build) {},
  };
}
