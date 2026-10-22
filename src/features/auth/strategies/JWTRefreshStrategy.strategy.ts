import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/JWTPayload.types.js';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AuthUser } from '../types/AuthUser.types.js';
import { sha256 } from '../utils/sha256.js';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthUser> {
    const auhorization = req.headers.authorization;

    if (!auhorization) {
      throw new UnauthorizedException();
    }

    const refreshToken = auhorization.replace('Bearer ', '').trim();

    const user = await this.userService.findUserWithRefresh(payload.sub);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    const isTokenMatching = await bcrypt.compare(
      sha256(refreshToken),
      user.hashedRefreshToken,
    );
    if (!isTokenMatching) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      login: payload.login,
    };
  }
}
