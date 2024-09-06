import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class Admin extends Document {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);


