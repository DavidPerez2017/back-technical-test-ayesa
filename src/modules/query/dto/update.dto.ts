import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  apiKey: string;
  
  @ApiProperty()
  fields: string;
  
  @ApiProperty()
  table: string;  
  
  @ApiProperty()
  condition: string; 

  @ApiProperty()
  modifier: string; 

  @ApiProperty()
  values: string; 

  @ApiProperty()
  returning: string; 

  constructor(apiKey, fields, table, condition, modifier, values, returning) {
    this.apiKey = apiKey;
    this.fields = fields;
    this.table = table;
    this.condition = condition;
    this.values = values;
    this.returning = returning;
  }
}

export default UpdateDto;