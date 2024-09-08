import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GlobalService } from 'src/utils/global';

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
        if (GlobalService.isLoadingUsers) {
            return { message: "Loading users" };
        } else {
            GlobalService.isLoadingUsers = true;
            return this.userService.loadUser();
        }
    }

    @Get('/all')
    // @UseGuards(AuthGuard)
    async getAllUsers(@Query("page") page: string, @Query("limit") limit: string, @Query("status") status?: string): Promise<any> {
        return this.userService.getUserWithPagination({ page, limit, status });
    }

    @Patch('/:userId')
    async updateUser(@Body() data: { status: string }, @Param("userId") userId: string): Promise<any> {
        return this.userService.updateUser(data, userId);
    }
}
