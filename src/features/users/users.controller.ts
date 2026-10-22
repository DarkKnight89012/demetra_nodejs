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
import { Pagination } from '../../types/pagination.types.js';
import { PublicUser } from './types/PublicUser.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './decorators/user.decorator.js';
import type { AuthUser } from '../auth/types/AuthUser.types.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('login') login?: string,
  ): Promise<Pagination<PublicUser>> {
    return await this.usersService.findUsers(page, limit, login);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @User() user: AuthUser) {
    await this.usersService.deleteUser(id, user);
  }

  @Get('current')
  async findCurrentUser(@User() user: AuthUser) {
    return await this.usersService.findCurrentUser(user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updatedUserFields: UpdateUserDto,
  ): Promise<PublicUser | null> {
    return await this.usersService.updateUser(id, updatedUserFields);
  }
}
