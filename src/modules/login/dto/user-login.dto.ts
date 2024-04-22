import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLogin {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // name: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
