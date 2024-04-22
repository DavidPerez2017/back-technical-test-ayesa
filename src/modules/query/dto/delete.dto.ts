import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteDto {
  @ApiProperty()
  table: string;

  @ApiProperty()
  condition: string;

  @ApiProperty()
  returning: string;

  constructor(table, condition, returning) {
    this.table = table;
    this.condition = condition;
    this.returning = returning;
  }
}

export default DeleteDto;
