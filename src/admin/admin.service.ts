import { Injectable } from '@nestjs/common';
import { AdminRepo } from './admin.repo';
import { LoginDto } from './admin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepo: AdminRepo,
        private readonly jwtService: JwtService
    ) { }


    async register(data: LoginDto) {
        return this.adminRepo.create(data);
    }


    async login(data: LoginDto) {
        const user = await this.adminRepo.findOne(data);
        if (!user) {
            return { message: 'User not found' };
        }
        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }
}
