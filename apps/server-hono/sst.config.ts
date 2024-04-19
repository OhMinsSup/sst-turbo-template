/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'hono-cf-ai',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'cloudflare',
    };
  },
  async run() {
    const hono = new sst.cloudflare.Worker('HonoCFAi', {
      url: true,
      handler: 'src/index.ts',
    });

    return {
      api: hono.url,
    };
  },
});
