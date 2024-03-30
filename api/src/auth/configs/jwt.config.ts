import * as process from 'process';
import { registerAs } from '@nestjs/config';

export type jwtConfigType = {
  accessSecret: string;
  refreshSecret: string;
};

function jwtConfigFactory(): jwtConfigType {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || accessSecret == '')
    throw new Error('Invalid JWT_ACCESS_SECRET');
  if (!refreshSecret || refreshSecret == '')
    throw new Error('Invalid JWT_REFRESH_SECRET');

  return {
    accessSecret,
    refreshSecret,
  };
}

export const jwtConfig = registerAs('jwtConfig', jwtConfigFactory);
