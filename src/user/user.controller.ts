import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, UserRequestDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('/add')
    async addUser(@Body() data: UserRequestDto) {
        return this.userService.addUser(data);
    }
}
