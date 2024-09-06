import { IsNotEmpty } from "class-validator";

export class AddUserDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    nic: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    career: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    serialNumber: string;

    @IsNotEmpty()
    docLink: string;

    @IsNotEmpty()
    contactNumber: string;

    ticketStatus: string;

    natureOfBusiness: string;

}


export class UserRequestDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    nic: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    career: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    docLink: string;

    @IsNotEmpty()
    contactNumber: string;

    natureOfBusiness: string;

}