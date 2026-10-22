import { UserEntity } from '../entities/user.entity.js';

export type PublicUser = Pick<
  UserEntity,
  'id' | 'login' | 'email' | 'age' | 'description'
>;
