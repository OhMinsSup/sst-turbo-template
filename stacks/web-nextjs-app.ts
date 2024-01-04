import type { StackContext } from 'sst/constructs';
import { NextjsSite } from 'sst/constructs';
import { env, defaultWebNextJsConfig } from './constants';

export function WebNextApp({ stack }: StackContext) {
  const site = new NextjsSite(stack, env.WEB_SST_ID, defaultWebNextJsConfig);

  const { cdk } = site;

  stack.addOutputs({
    Id: cdk?.distribution?.distributionId,
    SiteUrl: site.url,
  });
}
