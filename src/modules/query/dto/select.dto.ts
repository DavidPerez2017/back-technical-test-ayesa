import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SelectDto {
  @ApiProperty()
  fields: string;

  @ApiProperty()
  table: string;

  @ApiProperty()
  condition: string;

  @ApiProperty()
  modifier: string;

  constructor(fields, table, condition, modifier, returning) {
    this.fields = fields;
    this.table = table;
    this.condition = condition;
    this.modifier = modifier;
  }
}

export default SelectDto;
