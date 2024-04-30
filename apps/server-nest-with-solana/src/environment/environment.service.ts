import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) {}

  // -----------------------------------------------------------------------------
  // env
  // -----------------------------------------------------------------------------
  getEnv() {
    return this.configService.get<
      'development' | 'production' | 'test' | 'local'
    >('NODE_ENV');
  }

  getJwtAccessSecret() {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  // -----------------------------------------------------------------------------
  // wallet
  // -----------------------------------------------------------------------------
  getSignMessage() {
    return this.configService.get<string>('SIGN_MESSAGE');
  }
}
