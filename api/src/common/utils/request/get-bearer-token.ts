import { Request } from 'express';

export function getBearerToken(request: Request): string | null {
  const authHeaderValue = request.get('Authorization');
  if (!authHeaderValue || !authHeaderValue.startsWith('Bearer')) return null;
  return authHeaderValue.replace('Bearer', '').trim();
}
