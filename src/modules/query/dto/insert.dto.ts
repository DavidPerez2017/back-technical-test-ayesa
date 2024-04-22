import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InsertDto {
  
  @ApiProperty()
  fields: string;
  
  @ApiProperty()
  table: string;  

  @ApiProperty()
  values: string; 

  @ApiProperty()
  returning: string; 

  constructor(fields, table, values, returning) {
    this.fields = fields;
    this.table = table;
    this.values = values;
    this.returning = returning;
  }
}

export default InsertDto;