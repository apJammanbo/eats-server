import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.jwt) {
        const decoded = this.jwtService.verify(req.headers.jwt as string);
        const id = decoded['id'];
        const user = await this.usersService.getUser(id);
        req['user'] = user;
      }
    } catch (e) {}
    next();
  }
}
