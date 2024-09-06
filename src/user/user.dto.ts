import { IsNotEmpty } from "class-validator";

export class AddUserDto {

    name: string;

    address: string;

    nic: string;

    gender: string;

    career: string;

    email: string;

    serialNumber: string;

    docLink: string;

    contactNumber: string;

    ticketStatus: string;

    natureOfBusiness: string;

    sheetRowNumber: number;

}


export class UserRequestDto {

    name: string;

    address: string;

    nic: string;

    gender: string;

    career: string;

    email: string;

    docLink: string;

    contactNumber: string;

    natureOfBusiness: string;

    sheetRowNumber: number;

}