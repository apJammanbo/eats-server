import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

export interface JwtModuleOptions {
  secretKey: string;
}

@Global()
@Module({
  exports: [JwtService],
  providers: [JwtService],
})
export class JwtModule {}
