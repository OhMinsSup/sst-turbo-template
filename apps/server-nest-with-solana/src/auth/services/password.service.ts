import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { EnvironmentService } from '../../environment/environment.service';
import { assert } from '../../utils';

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly environment: EnvironmentService,
  ) {}

  /**
   *
   * 지갑에 서명할 일회용 비밀번호를 요청하는 이유는 사용자 인증을 위한 것입니다.
   * 이 방법은 블록체인 기반의 애플리케이션에서 흔히 사용되는 인증 방식입니다.
   *
   * 일반적으로 이 방법은 다음과 같은 과정을 거칩니다:
   *
   * 1). 서버는 일회용 비밀번호를 생성하고 사용자에게 전달합니다.
   * 2). 사용자는 이 비밀번호를 자신의 개인 키로 서명합니다.
   * 3).사용자는 서명된 메시지를 서버에 전달합니다.
   * 4). 서버는 사용자의 공개 키를 사용하여 서명을 검증합니다.
   *
   * 이 방식의 장점은 사용자의 개인 키가 서버에 전달되지 않으므로 보안성이 높다는 것입니다.
   * 또한, 일회용 비밀번호는 한 번만 사용되므로 재사용 공격을 방지할 수 있습니다.
   * 이 방식은 블록체인 지갑을 사용하여 인증하는 다양한 애플리케이션에서 사용됩니다.
   *
   * @param {string} userId
   */
  async generateOneTimePassword(userId: string): Promise<string> {
    const message = this.environment.getSignMessage();

    assert(message, 'SIGN_MESSAGE is not defined');

    const nonce = randomUUID();

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nonce,
      },
    });

    return `${message}${nonce}`;
  }
}
