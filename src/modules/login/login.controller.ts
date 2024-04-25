import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLogin } from './dto/user-login.dto';
import { LoginService } from './login.service';
import { Public } from 'decorators';
import { UserRegister } from './dto/user-register.dto';

@ApiTags('Auth Service')
@Controller('Auth')
export class LoginController {
  constructor(private service: LoginService) {}

  @Public()
  @Post('/login')
  login(@Body() dto: UserLogin) {
    return this.service.login(dto);
  }

  //  @UseGuards(JwtAuthGuard)
  @Public()
  @Post('/signUp')
  registerPos(@Body() dto: UserRegister) {
    return this.service.signUp(dto);
  }

  // @Get('user/:id')
  // getUserById(@Param('id') id: string){
  //     return this.loginService.getUSerNameById(id);
  // }
}
