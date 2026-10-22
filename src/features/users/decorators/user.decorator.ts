import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../auth/types/AuthUser.types.js';

export const User = createParamDecorator(
  (data: any, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
