import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateDto {
  @ApiProperty()
  fields: string;

  @ApiProperty()
  table: string;

  @ApiProperty()
  condition: string;

  @ApiProperty()
  returning: string;

  constructor(fields, table, condition, returning) {
    this.fields = fields;
    this.table = table;
    this.condition = condition;
    this.returning = returning;
  }
}

export default UpdateDto;
