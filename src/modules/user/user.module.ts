import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
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
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
