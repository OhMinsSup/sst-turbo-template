import createJiti from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);

export interface Module {
  env: Readonly<{
    SITE_URL: string;
    API_PREFIX: string;
    NODE_ENV: 'development' | 'test' | 'production';
    DEPLOY_GROUP: 'development' | 'local' | 'production';
    SST_NAME: string;
    SST_ID: string;
    SST_STAGE: 'dev' | 'staging' | 'prod';
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET: string;
  }>;
}

// Import env here to validate during build. Using jiti we can import .ts files :)
const modules = jiti('./src/env') as unknown as Module;

export { modules };
