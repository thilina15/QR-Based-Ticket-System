import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class User extends Document {

    @Prop({ required: false })
    name: string;

    @Prop({ required: false })
    address: string;

    @Prop({ required: false })
    nic: string;

    @Prop({ required: false })
    gender: string;

    @Prop({ required: false })
    career: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: false })
    serialNumber: string;

    @Prop({ required: false })
    docLink: string;

    @Prop({ required: false })
    contactNumber: string;

    @Prop({ required: false, default: 'pending' })
    ticketStatus: string;

    @Prop({ required: false })
    natureOfBusiness: string;

    @Prop({ required: false })
    sheetRowNumber: number;
}

export const UserSchema = SchemaFactory.createForClass(User);


