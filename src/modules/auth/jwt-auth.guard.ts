import {
  ExecutionContext,
  HttpException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return user;
    } else if (err || !user) {
      throw new HttpException(
        {
          error: 401,
          message: 'UnauthorizedException',
        },
        401,
      );
    }

    return user;
  }
}
