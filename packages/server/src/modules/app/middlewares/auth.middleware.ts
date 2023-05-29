import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService:JwtService){

  }
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.endsWith('/admin/login')) {
      next()
    } else {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).send('Unauthorized');
      } else {
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer') {
          res.status(401).send('Unauthorized');
        } else {
          // 这里可以验证 token,进行权限校验
          next();
        }
      }
    }
  }
}
