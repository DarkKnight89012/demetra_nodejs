import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/JWTPayload.types.js';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AuthUser } from '../types/AuthUser.types.js';
import { createHash } from 'crypto';

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

    const user = await this.userService.findUserById(payload.sub, true);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    const refershSha = createHash('sha256').update(refreshToken).digest('hex');

    const isTokenMatching = await bcrypt.compare(
      refershSha,
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
