import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

import { assert } from '../utils';

export class EnvironmentVariables {
  // -----------------------------------------------------------------------------
  // env
  // -----------------------------------------------------------------------------
  @IsString()
  @IsEnum(['development', 'production', 'test', 'local'])
  NODE_ENV: string;

  @IsString()
  SIGN_MESSAGE: string;

  @IsString()
  JWT_ACCESS_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config);

  const errors = validateSync(validatedConfig);
  assert(!errors.length, errors.toString());

  return validatedConfig;
}
