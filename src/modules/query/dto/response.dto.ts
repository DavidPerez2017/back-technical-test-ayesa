import { ApiProperty } from "@nestjs/swagger";

export class DResponse {
  @ApiProperty()
  response: boolean;
  
  @ApiProperty()
  result: any[];
  
  @ApiProperty()
  notice: string;  
  
  @ApiProperty()
  error: string;

  constructor(response, result, notice, error) {
    this.response = response;
    this.result = result;
    this.notice = notice;
    this.error = error;
  }
}

export default DResponse;