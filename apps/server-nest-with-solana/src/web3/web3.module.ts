import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './web3.module-definition';
import { Web3Service } from './web3.service';

@Global()
@Module({
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module extends ConfigurableModuleClass {}
