import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from './types/JWTPayload.types.js';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto.js';
import { AuthUser } from './types/AuthUser.types.js';
import { Tokens } from './types/Tokents.types.js';
import * as bcrypt from 'bcrypt';
import { hashToken } from './utils/hashToken.js';
import { hashString } from './utils/hashString.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Generation access method
  private async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }

  // Generation refresh method
  private async generateRefreshToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION',
      ) as JwtSignOptions['expiresIn'],
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  // Check pass method
  private async checkPassword(firstPass: string, secondPass: string) {
    return firstPass === secondPass;
  }

  // Create new tokens method
  private async createNewTokens(payload: JwtPayload) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    const hashedToken = await hashToken(refreshToken);

    await this.usersService.updateUserPassword(payload.sub, hashedToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  // Login method
  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findUserWithPassword(loginDto.login);

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      login: loginDto.login,
    };

    return await this.createNewTokens(payload);
  }

  // register method
  async register(createUser: CreateUserDto): Promise<Tokens> {
    const user = await this.usersService.findUserByLogin(createUser.login);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const passwordMatch = await this.checkPassword(
      createUser.password,
      createUser.repPassword,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Passwords mismatch');
    }

    const hashedPassword = await hashString(createUser.password);

    const { repPassword, ...userData } = createUser;

    const savedUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const payload: JwtPayload = {
      sub: savedUser.id,
      login: savedUser.login,
    };

    return await this.createNewTokens(payload);
  }

  // refresh generate method
  async refresh(user: AuthUser): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.userId,
      login: user.login,
    };
    return await this.createNewTokens(payload);
  }

  // logout
  async logout(user: AuthUser) {
    await this.usersService.deleteUserPassword(user.userId);
  }
}
