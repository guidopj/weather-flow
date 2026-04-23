import { Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';

import { UserService } from './application/user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
    deleteMeasurement(@Param('id') id: string) {
      return this.userService.delete(id);
    }

  @Post(':userId/subscription-alerts/:weatherStationId')
  subscribe(
    @Param('userId') userId: string,
    @Param('weatherStationId') weatherStationId: string,
  ) {
    return this.userService.subscribe(userId, weatherStationId);
  }

  @Post(':userId/subscription-alerts/:weatherStationId')
  unsubscribe(
    @Param('userId') userId: string,
    @Param('weatherStationId') weatherStationId: string,
  ) {
    return this.userService.unsubscribe(userId, weatherStationId);
  }
}
