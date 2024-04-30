import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { JwtDto, JwtPayload } from '../input/authorization.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateJwt(jwtDto: JwtDto): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: jwtDto.id },
    });

    if (!user) throw new NotFoundException('User not found');
    return { ...user, type: 'user' };
  }
}
