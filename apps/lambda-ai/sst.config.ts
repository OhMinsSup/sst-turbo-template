import { type SSTConfig } from 'sst';

export default {
  config() {
    return {
      name: '@templates/lambda-ai',
      region: 'ap-northeast-2',
      stage: 'dev',
    };
  },
  async stacks(application) {
    const appStacks = await import('./stacks');
    appStacks.default(application);
  },
} satisfies SSTConfig;
