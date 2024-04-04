import { UAParser } from 'ua-parser-js';
import { Request } from 'express';

export function getDeviceTitle(request: Request): string {
  const ua = UAParser(request.get('user-agent'));
  return `${ua.os.name} (v${ua.os.version}): ${ua.browser.name} (v${ua.browser.version})`;
}
