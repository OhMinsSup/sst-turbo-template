import { Controller, Post } from '@nestjs/common';

import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  signup() {
    return null;
  }
}
