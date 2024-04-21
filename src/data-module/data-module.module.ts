import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { URequest } from 'src/utilities/URequest';
import { CDataController } from './controllers/CDataController';
import { MData } from './models/MData';


@Module({
    imports: [HttpModule],
    controllers: [CDataController],
    providers: [MData, URequest],
    exports: [MData]
  })
export class DataModuleModule {}
