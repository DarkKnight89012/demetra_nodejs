import { Like, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseUsersRepository } from './users.repository.abstract.js';
import { Injectable } from '@nestjs/common';
import { PUBLIC_USER_SELECT_FIELDS } from '../consts/PublicUserSelectFields.js';
import { UserWithPass } from '../types/UserWithPass.js';
import { UserWithRefreshToken } from '../types/UserWithRefresh.js';

@Injectable()
export class UsersRepository implements BaseUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUsers(page: number, limit: number, login?: string) {
    const skip = (page - 1) * limit;

    const [result, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: skip,
      where: login ? { login: Like(`${login}%`) } : {},
      select: PUBLIC_USER_SELECT_FIELDS,
    });

    return {
      data: result,
      total: total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(id: string) {
    const result = await this.userRepository.softDelete(id);

    return result.affected !== 0;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: PUBLIC_USER_SELECT_FIELDS,
    });
    return user;
  }

  async updateUser(id: string, updatedUserFields: Partial<UserEntity>) {
    const result = await this.userRepository.update(id, {
      ...updatedUserFields,
    });

    return result.affected !== 0;
  }

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { login },
      select: PUBLIC_USER_SELECT_FIELDS,
    });
    return user;
  }

  async createUser(user: Partial<UserEntity>) {
    this.userRepository.create(user);
    return await this.userRepository.save(user);
  }

  async updateUserPassword(id: string, refreshToken: string) {
    const result = await this.userRepository.update(id, {
      hashedRefreshToken: refreshToken,
    });

    return result.affected !== 0;
  }

  async deleteUserPassword(id: string) {
    const result = await this.userRepository.update(id, {
      hashedRefreshToken: null,
    });
    return result.affected !== 0;
  }

  async findUserPassword(login: string): Promise<UserWithPass | null> {
    const user = await this.userRepository.findOne({
      where: { login },
      select: {
        id: true,
        password: true,
      },
    });
    return user;
  }

  async findUserWithRefresh(id: string): Promise<UserWithRefreshToken | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        hashedRefreshToken: true,
      },
    });
    return user;
  }
}
