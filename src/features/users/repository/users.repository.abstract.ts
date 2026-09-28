import { Pagination } from '../../../types/pagination.types.js';
import { UserEntity } from '../entities/user.entity.js';

export abstract class BaseUsersRepository {
  abstract findUsers(
    page: number,
    limit: number,
    login?: string,
  ): Promise<Pagination<UserEntity>>;

  abstract softDelete(id: string): Promise<boolean>;

  abstract findUserById(
    id: string,
    withHashRefersh?: boolean,
  ): Promise<UserEntity | null>;

  abstract findUserByLogin(login: string): Promise<UserEntity | null>;

  abstract updateUser(
    id: string,
    updatedUserFields: Partial<UserEntity>,
  ): Promise<boolean>;

  abstract createUser(user: Partial<UserEntity>): Promise<UserEntity>;
}
