import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  CreateRolDto,
  UpdateRolDto,
  LoginUserDto,
  LoginPinUserDto,
} from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('login-pin')
  loginPin(@Body() loginPinUserDto: LoginPinUserDto) {
    return this.authService.loginPin(loginPinUserDto);
  }

  //! CRUD ROLES

  @Post('rol')
  create(@Body() createRolDto: CreateRolDto) {
    return this.authService.create(createRolDto);
  }

  @Get('rol')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  @Get('rol/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Patch('rol/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthDto: UpdateRolDto,
  ) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('rol/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
