import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { AddUserDto, UserRequestDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';
import { GoogleSheetService } from 'src/services/google-sheet';
import { StringFormating } from 'src/utils/formating';
import { SendgridService } from 'src/services/sendgrid';
const QRCode = require('qrcode')

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepo,
        private googleSheetService: GoogleSheetService,
        private sendgridService: SendgridService
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

        userData.docLink = StringFormating.makePublinkDocLink(data.docLink);
        userData.contactNumber = data.contactNumber;
        userData.ticketStatus = 'pending';
        userData.natureOfBusiness = data.natureOfBusiness;
        userData.sheetRowNumber = data.sheetRowNumber;
        try {
            const user = await this.userRepo.create(userData);
            return user;
        } catch (error) {
            console.log("error adding user")
        }
    }

    async loadUser() {
        try {
            const lastRow = await this.getLastUserRowId();
            const rows = await this.googleSheetService.getRows({ offset: lastRow - 1, limit: 50 });
            rows.forEach(row => {
                const userData = new UserRequestDto();
                userData.name = row.get('Name');
                userData.address = row.get("Address\nRes. No. & Street / City / District");
                userData.nic = row.get("NIC No.");
                userData.gender = row.get('Gender')
                userData.career = row.get('Career');
                userData.email = row.get('Email Address');
                userData.contactNumber = row.get('Contact no.');
                userData.natureOfBusiness = row.get('Nature Of The Business');
                userData.docLink = row.get('Attache Payment Slip');
                userData.sheetRowNumber = row.rowNumber;
                this.addUser(userData);
            })
            if (rows.length < 1) {
                return { message: "No new data found" }
            } else {
                return { message: rows.length + " new data added" }
            }

        } catch (error) {
            return { message: "Error loading data" }
        }
    }

    async getLastUserRowId() {
        const user = await this.userRepo.findLast();
        console.log(user.sheetRowNumber)
        return user.sheetRowNumber;
    }

    async getUserWithPagination(data: { limit: string, page: string }) {
        const limit = Number(data.limit);
        const page = Number(data.page);
        const totalUsersCount = await this.userRepo.totalUserCount();
        const totalPages = Math.ceil(totalUsersCount / limit)
        const hasNextPage = page * limit < totalUsersCount
        const hasPrevPage = page > 1
        const currentPage = page
        const users = await this.userRepo.findWithPagination({ limit: data.limit, offset: (page - 1) * limit });

        return {
            users,
            pagination: {
                totalPages,
                hasNextPage,
                hasPrevPage,
                currentPage
            }
        }
    }

    async updateUser(data: { status: string }, userId: string) {
        try {
            // const user = await this.userRepo.findOne({ _id: userId });
            // user.ticketStatus = data.status;
            // return user.save();
            const url = 'https://facebook.com';
            const qrCodeImage = await QRCode.toDataURL(url);
            const image = `<img src="${qrCodeImage}" alt="QR Code"/>`;

            await this.sendgridService.sendEmail({ to: "thibbatz@gmail.com", subject: "Ticket Status", html: image })
            return { message: "User updated" }
        } catch (error) {
            return { message: "Error updating user" }
        }
    }
}
