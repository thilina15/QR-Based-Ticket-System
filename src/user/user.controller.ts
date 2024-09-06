import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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
    // @UseGuards(AuthGuard)
    async getAllUsers(@Query("page") page: string, @Query("limit") limit: string) {
        return this.userService.getUserWithPagination({ page, limit });
    }

    @Patch('/:userId')
    async updateUser(@Body() data: { status: string }, @Param("userId") userId: string): Promise<any> {
        return this.userService.updateUser(data, userId);
    }
}
