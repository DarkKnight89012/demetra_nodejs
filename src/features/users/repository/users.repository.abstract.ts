import { Pagination } from '../../../types/pagination.types.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserEntity } from '../entities/user.entity.js';
import { PublicUser } from '../types/PublicUser.js';
import { UserWithPass } from '../types/UserWithPass.js';
import { UserWithRefreshToken } from '../types/UserWithRefresh.js';

export abstract class BaseUsersRepository {
  abstract findUsers(
    page: number,
    limit: number,
    login?: string,
  ): Promise<Pagination<PublicUser>>;

  abstract softDelete(id: string): Promise<boolean>;

  abstract findUserById(id: string): Promise<PublicUser | null>;

  abstract findUserByLogin(login: string): Promise<PublicUser | null>;

  abstract updateUser(
    id: string,
    updatedUserFields: UpdateUserDto,
  ): Promise<boolean>;

  abstract createUser(user: Partial<UserEntity>): Promise<PublicUser>;

  abstract updateUserPassword(
    id: string,
    refreshToken: string | null,
  ): Promise<boolean>;

  abstract deleteUserPassword(id: string): Promise<boolean>;

  abstract findUserPassword(login: string): Promise<UserWithPass | null>;

  abstract findUserWithRefresh(
    id: string,
  ): Promise<UserWithRefreshToken | null>;
}
