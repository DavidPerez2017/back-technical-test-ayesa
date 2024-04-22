import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterDto {

    @ApiProperty()
    @IsNotEmpty()
    use_code: string;

    @ApiProperty()
    @IsNotEmpty()
    use_name: string;

    @ApiProperty()
    @IsNotEmpty()
    doc_type: string;

    @ApiProperty()
    @IsNotEmpty()
    doc_number: string;

    @ApiProperty()
    @IsNotEmpty()
    use_passwo: string;

    @ApiProperty()
    @IsNotEmpty()
    system: string;
}