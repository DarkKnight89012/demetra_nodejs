import { hashString } from './hashString.js';
import { sha256 } from './sha256.js';

export const hashToken = async (refreshToken: string) => {
  return await hashString(sha256(refreshToken));
};
