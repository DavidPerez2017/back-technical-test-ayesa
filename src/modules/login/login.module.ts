import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigModule } from '@nestjs/config';
import { QueryModule } from '../query/query.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    JwtModule,
    QueryModule,
    // forwardRef(() => LoginModule),
  ],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
