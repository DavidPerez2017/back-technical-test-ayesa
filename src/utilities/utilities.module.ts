import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { URequest } from './URequest';

@Module({
    imports: [HttpModule],
    providers: [URequest],
    exports: [URequest]
})
export class UtilitiesModule {}
