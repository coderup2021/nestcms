import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ILogin } from 'src/interface';

@Controller('api')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Get('/me')
  async me() {
    //TODO validate password
    return {
      status: 0,
      payload: { username: 'admin' },
    };
  }

  @Post('/admin/login')
  async login(@Body() body: ILogin) {
    const { username, password } = body;
    //TODO validate password
    if (username === 'admin' && password === '123456') {
      const token = this.service.getToken(username);
      return {
        status: 0,
        payload: { token: `Bearer ${token}` },
      };
    } else {
      return {
        status: -1,
        payload: null,
        message: 'userOrPasswordError',
      };
    }
  }
}
