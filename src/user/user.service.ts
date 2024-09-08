import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { AddUserDto, UserRequestDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';
import { GoogleSheetService } from 'src/services/google-sheet';
import { StringFormating } from 'src/utils/formating';
import { SendgridService } from 'src/services/sendgrid';
import { EmailTemplate } from 'src/utils/template';
import { TicketStatus } from 'src/utils/ticket-status';
import { GlobalService } from 'src/utils/global';
const QRCode = require('qrcode')

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepo,
        private googleSheetService: GoogleSheetService,
        private sendgridService: SendgridService
    ) { }

    async addUser(data: UserRequestDto): Promise<any> {
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
        userData.ticketStatus = TicketStatus.Pending;
        userData.natureOfBusiness = data.natureOfBusiness;
        userData.sheetRowNumber = data.sheetRowNumber;
        const users = await this.userRepo.find({ email: data.email, ticketStatus: { $ne: TicketStatus.Deleted } })
        console.log(userData.email + " 1")
        if (users.length > 0) {
            let isOldUserUpdated = false;
            for (const user of users) {
                // set user status to duplicate
                if (user.ticketStatus == TicketStatus.Approved) {
                    isOldUserUpdated = true;
                    await this.userRepo.update({ ticketStatus: TicketStatus.DuplicatedApproved }, user.id);
                } else if (user.ticketStatus == TicketStatus.Pending) {
                    isOldUserUpdated = true;
                    await this.userRepo.update({ ticketStatus: TicketStatus.Duplicated }, user.id);
                }
            }
            if (isOldUserUpdated) {
                // same email users available to check
                userData.ticketStatus = TicketStatus.Duplicated;
            } else {
                // same email users available but all are rejected
                userData.ticketStatus = TicketStatus.Pending;
            }
        }
        try {
            console.log(userData.email + " 4")
            const user = await this.userRepo.create(userData);
            return user;
        } catch (error) {
            console.log("error adding user" + error)
        }
    }

    async loadUser() {
        try {
            const lastRow = await this.getLastUserRowId()
            console.log(lastRow)
            const rows = await this.googleSheetService.getRows({ offset: lastRow - 1, limit: 50 });
            for (const row of rows) {
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
                await this.addUser(userData);
            }
            if (rows.length < 1) {
                GlobalService.isLoadingUsers = false;
                return { message: "No new data found" }
            } else {
                GlobalService.isLoadingUsers = false;
                return { message: rows.length + " new data added" }
            }

        } catch (error) {
            GlobalService.isLoadingUsers = false;
            return { message: "Error loading data" }
        }
    }

    async getLastUserRowId() {
        const total = await this.userRepo.totalUserCount("all");
        if (total < 1) {
            return 1;
        }
        const user = await this.userRepo.findLast();
        console.log(user.sheetRowNumber)
        return user.sheetRowNumber;
    }

    async getUserWithPagination(data: { limit: string, page: string, status: string }): Promise<any> {
        const limit = Number(data.limit);
        const page = Number(data.page);
        const totalUsersCount = await this.userRepo.totalUserCount(data.status);
        const totalPages = Math.ceil(totalUsersCount / limit)
        const hasNextPage = page * limit < totalUsersCount
        const hasPrevPage = page > 1
        const currentPage = page
        const users = await this.userRepo.findWithPagination({ limit: data.limit, offset: (page - 1) * limit, status: data.status });

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

    async updateUser(data: { status: string }, userId: string): Promise<{ message: string }> {
        try {
            const user = await this.userRepo.findOne({ _id: userId })
            if (!user) {
                return { message: "User not found" }
            }
            if (data.status === TicketStatus.Approved) {
                try {
                    const url = 'http://194.233.74.107:3500/?qrid=' + user.id;
                    const qrCodeImage = await QRCode.toDataURL(url);
                    const image = qrCodeImage.split(',')[1]
                    const attTemplate = EmailTemplate.createTemplate({ name: user.name, qr: qrCodeImage, serial: user.serialNumber })
                    const attachment = await EmailTemplate.getAttachment(attTemplate)
                    const body = "your ticket details is attached"
                    await this.sendgridService.sendEmail({ to: user.email, body: body, code: attachment })
                } catch (error) {
                    await this.userRepo.update({ ticketStatus: TicketStatus.EmailFailedApproved }, userId);
                    return { message: "User updated with error" }
                }
                await this.userRepo.update({ ticketStatus: data.status }, userId);
                return { message: "User updated: " + data.status }
            }
            else if (data.status === TicketStatus.Rejected || data.status === TicketStatus.Deleted) {
                await this.userRepo.update({ ticketStatus: data.status }, userId);
                // check if user has duplicate or duplicate approved status
                const duplications = await this.userRepo.find({ email: user.email, ticketStatus: TicketStatus.Duplicated })
                const duplicationsApproved = await this.userRepo.find({ email: user.email, ticketStatus: TicketStatus.DuplicatedApproved })
                const pendings = await this.userRepo.find({ email: user.email, ticketStatus: TicketStatus.Pending })

                // set one any only duplication aprved to aprove status
                if (duplications.length == 0 && duplicationsApproved.length == 1) {
                    await this.userRepo.update({ ticketStatus: TicketStatus.Approved }, duplicationsApproved[0].id);
                }

                // set only duplicate to pending status
                if (duplications.length == 1 && pendings.length == 0) {
                    await this.userRepo.update({ ticketStatus: TicketStatus.Pending }, duplications[0].id);
                }

                return { message: "User updated: " + data.status }
            }
        } catch (error) {
            return { message: "Error updating user" + error }
        }
    }
}
