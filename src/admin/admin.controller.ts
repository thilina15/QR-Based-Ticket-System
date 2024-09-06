import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './admin.dto';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }


    @Post('/register')
    async register(@Body() data: LoginDto) {
        return this.adminService.register(data);
    }

    @Post('/login')
    async login(@Body() data: LoginDto) {
        return this.adminService.login(data);
    }
}
