import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, UserRequestDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('')
    async addUser(@Body() data: UserRequestDto) {
        return this.userService.addUser(data);
    }

    @Get('/load')
    async loadUsers() {
        return this.userService.loadUser();
    }

    @Get('/all')
    async getAllUsers(@Query("page") page: string, @Query("limit") limit: string) {
        return this.userService.getUserWithPagination({ page, limit });
    }

    @Patch('/:userId')
    async updateUser(@Body() data: { status: string }, @Query("userId") userId: string) {
        return this.userService.updateUser(data, userId);
    }
}
