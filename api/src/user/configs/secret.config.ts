import * as process from 'process';
import { registerAs } from '@nestjs/config';

export type secretConfigType = {
  passwordHashSecret: string;
  passwordHashSalt?: string | null;
};

function secretConfigFactory(): secretConfigType {
  const passwordHashSecret = process.env.PASSWORD_HASH_SECRET;
  let passwordHashSalt = process.env.PASSWORD_HASH_SALT;

  if (!passwordHashSecret || passwordHashSecret == '')
    throw new Error('Invalid PASSWORD_HASH_SECRET');

  if (!passwordHashSalt || passwordHashSalt == '') passwordHashSalt = undefined;

  return { passwordHashSecret, passwordHashSalt };
}

export const secretConfig = registerAs('secretConfig', secretConfigFactory);
