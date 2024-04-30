import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder({
    moduleName: 'SerializeModule',
  })
    .setClassMethodName('forRoot')
    .build();
