import { AuthUser } from './AuthUser.types.js';

export type UserWithRequest = Request & { user: AuthUser };
