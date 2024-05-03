import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvironmentModule } from './environment/environment.module';
import { EnvironmentService } from './environment/environment.service';
import { SerializeModule } from './serialize/serialize.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersService } from './users/services/users.service';
import { UsersModule } from './users/users.module';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [
    EnvironmentModule.forRoot({}),
    SerializeModule.forRoot({}),
    Web3Module.forRoot({}),
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
    PrismaModule.forRoot({
      isGlobal: true,

      prismaServiceOptions: {
        middlewares: [loggingMiddleware()],
        prismaOptions: { errorFormat: 'pretty' },
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
