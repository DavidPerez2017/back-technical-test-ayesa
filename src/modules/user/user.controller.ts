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

@ApiTags('User Service')
@UseGuards(JwtAuthGuard)
@Controller('User')
export class UserController {
  constructor(private service: UserService) {}

  @Get('/getAll')
  getAll() {
    return this.service.getAllUsers();
  }

  @Delete('/delUser/:id')
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
