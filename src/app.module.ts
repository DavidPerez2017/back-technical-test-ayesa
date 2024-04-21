import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { DataModuleModule } from './data-module/data-module.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule, 
    DataModuleModule,
     ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
