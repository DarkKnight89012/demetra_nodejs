import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard.js';
import type { UserWithRequest } from './types/UserWithRequest.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { User } from '../users/decorators/user.decorator.js';
import type { AuthUser } from './types/AuthUser.types.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@User() user: AuthUser) {
    await this.authService.logout(user);
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return await this.authService.register(createUser);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@User() user: AuthUser) {
    return this.authService.refresh(user);
  }
}
