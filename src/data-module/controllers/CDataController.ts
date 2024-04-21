import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import DOperation from '../dtos/DOperation';
import { MData } from '../models/MData';

@Controller('data')
export class CDataController {

    constructor(private mData: MData) { }

    @Post('Query')
    @ApiOperation({ summary: 'Query service data' })
    Query(@Body() dOperation: DOperation) {
        return this.mData.Query(dOperation);
    }

    @Post('Add')
    @ApiOperation({ summary: 'Add service data' })
    Add(@Body() dOperation: DOperation) {
        return this.mData.Add(dOperation);
    }

    @Put('Edit')
    @ApiOperation({ summary: 'Edit service data' })
    Edit(@Body() dOperation: DOperation) {
        return this.mData.Edit(dOperation);
    }

    @Post('Delete')
    @ApiOperation({ summary: 'Delete service data' })
    Delete(@Body() dOperation: DOperation) {
        return this.mData.Delete(dOperation);
    }
}
