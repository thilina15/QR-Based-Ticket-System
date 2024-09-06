import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { AddUserDto, UserRequestDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepo
    ) { }

    async addUser(data: UserRequestDto) {
        let userData = new AddUserDto();
        userData.name = data.name;
        userData.address = data.address;
        userData.nic = data.nic;
        userData.gender = data.gender;
        userData.career = data.career;
        userData.email = data.email;
        userData.serialNumber = uuidv4();

        // doc link creation...
        const docLink = "link";
        userData.docLink = docLink;
        userData.contactNumber = data.contactNumber;
        userData.ticketStatus = 'pending';
        userData.natureOfBusiness = data.natureOfBusiness;

        return this.userRepo.create(userData);
    }
}
