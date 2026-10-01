import * as bcrypt from 'bcrypt';

export async function hashString(password: string) {
  return await bcrypt.hash(password, 10);
}
