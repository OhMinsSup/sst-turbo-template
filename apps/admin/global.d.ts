declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DEPLOY_GROUP: 'development' | 'production' | 'local';

      SITE_URL: string;
      API_PREFIX: string;

      SKIP_ENV_VALIDATION: string | undefined;
    }
  }
}

interface Window extends globalThis {
  __DOMAIN_INFO__: {
    host: string;
    protocol: string;
    isLocalhost: boolean;
    domainUrl: string;
  };

  __ENV__: {
    SITE_URL: string;
    API_HOST: string;
    NODE_ENV: 'development' | 'production' | 'test';
  };
}
