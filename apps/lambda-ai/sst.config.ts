/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'lambda-ai',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const hono = new sst.aws.Function('LambdaAiServer', {
      url: true,
      handler: 'index.handler',
    });

    return {
      // 한국 리전에서 실행
      reigon: aws.getRegionOutput().name,
      api: hono.url,
    };
  },
});
