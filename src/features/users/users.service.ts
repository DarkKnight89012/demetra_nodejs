import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/types/AuthUser.types.js';
import { UserEntity } from './entities/user.entity.js';
import { Pagination } from '../../types/pagination.types.js';
import { BaseUsersRepository } from './repository/users.repository.abstract.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: BaseUsersRepository) {}

  async findUsers(
    page: number,
    limit: number,
    login?: string,
  ): Promise<Pagination<UserEntity>> {
    return await this.userRepository.findUsers(page, limit, login);
  }

  async deleteUser(id: string) {
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

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findUserByLogin(login);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserById(
    id: string,
    withHashRefersh?: boolean,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findUserById(id, withHashRefersh);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updatedUserFields: Partial<UserEntity>) {
    const isUpdated = await this.userRepository.updateUser(id, {
      ...updatedUserFields,
    });

    if (!isUpdated) {
      throw new NotFoundException('User not found');
    }

    return this.findUserById(id);
  }

  async setCurrentRefreshToken(id: string, refreshToken: string | null) {
    await this.userRepository.updateUser(id, {
      hashedRefreshToken: refreshToken,
    });
  }
}
