import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvironmentModule } from './environment/environment.module';
import { EnvironmentService } from './environment/environment.service';
import { SerializeModule } from './serialize/serialize.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersService } from './users/services/users.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EnvironmentModule.forRoot({}),
    SerializeModule.forRoot({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (environment: EnvironmentService) => {
        const secret = await Promise.resolve(environment.getJwtAccessSecret());
        return {
          secret,
          signOptions: { expiresIn: '30d' },
        };
      },
      inject: [EnvironmentService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
