import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { QueryService } from './query-service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}
