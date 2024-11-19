import { Global, Module } from "@nestjs/common";

import { GlobalErrorService } from "./global-error.service";

@Global()
@Module({
  imports: [],
  providers: [GlobalErrorService],
  exports: [GlobalErrorService],
})
export class GlobalErrorModule {}
