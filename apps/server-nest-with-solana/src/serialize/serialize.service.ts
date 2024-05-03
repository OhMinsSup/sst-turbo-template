import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

import type {
  SerializeExternalUser,
  SerializeImage,
  SerializePassword,
  SerializeRoles,
  SerializeWallet,
} from './serialize.interface';

@Injectable()
export class SerializeService {
  getImage(image: any) {
    const clone = isEmpty(image) ? {} : { ...image };
    const data = clone as SerializeImage;
    Object.keys(data).forEach((key) => {
      data[key] = this.transformDataToUndefined(clone[key]);
    });
    return data;
  }

  getPassword(password: any) {
    const clone = isEmpty(password) ? {} : { ...password };
    const data = clone as SerializePassword;
    Object.keys(data).forEach((key) => {
      data[key] = this.transformDataToUndefined(clone[key]);
    });
    return data;
  }

  getWallet(wallet: any) {
    const clone = isEmpty(wallet) ? {} : { ...wallet };
    const data = clone as SerializeWallet;
    Object.keys(data).forEach((key) => {
      data[key] = this.transformDataToUndefined(clone[key]);
    });
    return data;
  }

  getWallets(wallets: any) {
    if (!wallets) {
      return [];
    }
    return wallets.map((wallet: any) => this.getWallet(wallet));
  }

  getRole(role: any) {
    const clone = isEmpty(role) ? {} : { ...role };
    const data = clone as SerializeRoles;
    Object.keys(data).forEach((key) => {
      data[key] = this.transformDataToUndefined(clone[key]);
    });
    return data;
  }

  getRoles(roles: any) {
    if (!roles) {
      return [];
    }
    return roles.map((role: any) => this.getRole(role));
  }

  getExternalUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      image: this.getImage(user.image),
      wallets: this.getWallets(user.wallets),
      roles: this.getRoles(user.roles),
    } as SerializeExternalUser;
  }

  transformDataToUndefined(data: any) {
    if (data === null) {
      return undefined;
    }

    if (typeof data === 'string' && data === '') {
      return undefined;
    }

    if (typeof data === 'number' && isNaN(data)) {
      return undefined;
    }

    if (typeof data === 'object' && isEmpty(data)) {
      return undefined;
    }

    return data;
  }

  transformDataToNull(data: any) {
    if (data === undefined) {
      return null;
    }

    if (typeof data === 'string' && data === '') {
      return null;
    }

    if (typeof data === 'number' && isNaN(data)) {
      return null;
    }

    if (typeof data === 'object' && isEmpty(data)) {
      return null;
    }

    return data;
  }
}
