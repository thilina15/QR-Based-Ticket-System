import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class User extends Document {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    nic: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    career: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    serialNumber: string;

    @Prop({ required: true })
    docLink: string;

    @Prop({ required: true })
    contactNumber: string;

    @Prop({ required: false, default: 'pending' })
    ticketStatus: string;

    @Prop({ required: false })
    natureOfBusiness: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


