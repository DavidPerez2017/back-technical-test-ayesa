import { ApiProperty } from "@nestjs/swagger";

export class DResponse {
  @ApiProperty()
  message: string;
  
  @ApiProperty()
  result: JSON;
  
  @ApiProperty()
  notice: string;  
  
  @ApiProperty()
  error: string;

  constructor(message, result, notice, error) {
    this.message = message;
    this.result = result;
    this.notice = notice;
    this.error = error;
  }
}

export default DResponse;