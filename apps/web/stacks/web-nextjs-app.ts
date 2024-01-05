import type { StackContext } from 'sst/constructs';
import { NextjsSite } from 'sst/constructs';
import { envVars, defaultWebNextJsConfig } from './constants';

export function WebNextApp({ stack }: StackContext) {
  const site = new NextjsSite(
    stack,
    envVars.WEB_SST_ID,
    defaultWebNextJsConfig,
  );

  const { cdk } = site;

  stack.addOutputs({
    Id: cdk?.distribution?.distributionId,
    SiteUrl: site.url,
  });
}
