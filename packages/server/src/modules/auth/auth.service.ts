import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getToken(content:string){
    return this.jwtService.sign({payload:{content}})
  }
  // save
}
