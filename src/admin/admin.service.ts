import { Injectable } from '@nestjs/common';
import { AdminRepo } from './admin.repo';
import { LoginDto } from './admin.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepo: AdminRepo
    ) { }


    async register(data: LoginDto) {
        return this.adminRepo.create(data);
    }


    async login(data: LoginDto) {
        const user = await this.adminRepo.findOne(data);
        if (!user) {
            return { message: 'User not found' };
        }
        return user;
    }
}
