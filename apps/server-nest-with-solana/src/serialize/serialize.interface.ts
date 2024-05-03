import {
  type Password,
  type Permission,
  type Role,
  type User,
  type UserImage,
  type Wallet,
} from '@prisma/client';

export type SerializeImage = Pick<
  UserImage,
  'altText' | 'blob' | 'contentType'
>;

export type SerializePassword = Pick<Password, 'hash'>;

export type SerializeWallet = Pick<Wallet, 'address' | 'connectedAt'>;

export type SerializePermissions = Pick<
  Permission,
  'action' | 'entity' | 'access' | 'description'
>;

export type SerializeRoles = Pick<Role, 'name' | 'description'>;

export type SerializeUser = Pick<
  User,
  'id' | 'email' | 'username' | 'name' | 'nonce'
>;

export type SerializeExternalUser = Omit<SerializeUser, 'nonce'> & {
  image: SerializeImage;
  wallets: SerializeWallet[];
  roles: SerializeRoles[];
};

export type SerializeInternalUser = SerializeUser & {
  image: SerializeImage;
  password: SerializePassword;
  wallets: SerializeWallet[];
  roles: SerializeRoles[];
};
