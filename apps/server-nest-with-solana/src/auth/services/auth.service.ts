import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { getUserExternalFullSelector } from '../../selectors/user';
import { SerializeService } from '../../serialize/serialize.service';
import { assert } from '../../utils';
import { JwtDto, JwtPayload } from '../input/authorization.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serialize: SerializeService,
  ) {}

  async validateJwt(jwtDto: JwtDto): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: jwtDto.id },
      select: getUserExternalFullSelector(),
    });

    assert(user, 'User not found', NotFoundException);

    return this.serialize.getExternalUser(user);
  }
}
