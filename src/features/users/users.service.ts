import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../auth/types/AuthUser.types.js';
import { UserEntity } from './entities/user.entity.js';
import { Pagination } from '../../types/pagination.types.js';
import { BaseUsersRepository } from './repository/users.repository.abstract.js';
import { PublicUser } from './types/PublicUser.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserWithPass } from './types/UserWithPass.js';
import { UserWithRefreshToken } from './types/UserWithRefresh.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: BaseUsersRepository) {}

  async findUsers(
    page: number,
    limit: number,
    login?: string,
  ): Promise<Pagination<PublicUser>> {
    return await this.userRepository.findUsers(page, limit, login);
  }

  async deleteUser(id: string, user: AuthUser) {
    if (id !== user.userId) {
      throw new ForbiddenException('No access to delete this user');
    }

    const deleted = await this.userRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }

  async findCurrentUser(user: AuthUser) {
    return await this.findUserById(user.userId);
  }

  async createUser(user: Partial<UserEntity>) {
    return await this.userRepository.createUser(user);
  }

  async findUserByLogin(login: string): Promise<PublicUser | null> {
    const user = await this.userRepository.findUserByLogin(login);

    return user;
  }

  async findUserById(id: string): Promise<PublicUser | null> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updatedUserFields: UpdateUserDto) {
    const isUpdated = await this.userRepository.updateUser(id, {
      ...updatedUserFields,
    });

    if (!isUpdated) {
      throw new NotFoundException('User not found');
    }

    return this.findUserById(id);
  }

  async updateUserPassword(id: string, refreshToken: string) {
    await this.userRepository.updateUserPassword(id, refreshToken);
  }

  async findUserWithPassword(login: string): Promise<UserWithPass | null> {
    return await this.userRepository.findUserPassword(login);
  }

  async findUserWithRefresh(id: string): Promise<UserWithRefreshToken | null> {
    return await this.userRepository.findUserWithRefresh(id);
  }

  async deleteUserPassword(id: string): Promise<boolean> {
    return await this.userRepository.deleteUserPassword(id);
  }
}
