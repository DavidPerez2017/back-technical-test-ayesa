import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user-login.dto';

@ApiTags('User Service')
@UseGuards(JwtAuthGuard)
@Controller('User')
export class UserController {
  constructor(private service: UserService) {}

  @Get('/getAll')
  getAll() {
    return this.service.getAllUsers();
  }

  @Patch('/editUser/:id')
  editUser(@Param('id') id: string, @Body() dto: UserDto) {
    return this.service.editUser(id, dto);
  }

  @Delete('/delUser/:id')
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
