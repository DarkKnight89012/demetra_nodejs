import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { UserWithRequest } from '../auth/types/UserWithRequest.js';
import { Pagination } from '../../types/pagination.types.js';
import { UserEntity } from './entities/user.entity.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('login') login?: string,
  ): Promise<Pagination<UserEntity>> {
    return await this.usersService.findUsers(page, limit, login);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async findCurrentUser(@Req() req: UserWithRequest) {
    return await this.usersService.findCurrentUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updatedUserFields: Partial<UserEntity>,
  ) {
    return await this.usersService.updateUser(id, updatedUserFields);
  }
}
