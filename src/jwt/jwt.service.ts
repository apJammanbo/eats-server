import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: Record<string, unknown>) {
    return sign(payload, this.configService.get('SECRET_KEY'));
  }

  verify(token: string) {
    return verify(token, this.configService.get('SECRET_KEY'));
  }
}
