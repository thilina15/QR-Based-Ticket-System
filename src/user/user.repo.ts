import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";

@Injectable()
export class UserRepo {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    async create(data: any) {
        const admin = new this.userModel(data);
        return admin.save();
    }

    async findOne(data: any): Promise<User | undefined> {
        return this.userModel.findOne(data).exec();
    }

    async find(data: any): Promise<User[]> {
        return this.userModel.find(data).exec();
    }

    async findLast() {
        return this.userModel.findOne().sort({ _id: -1 });
    }

    async findWithPagination(data: any) {
        return this.userModel.find().limit(data.limit).skip(data.offset);
    }

    async totalUserCount() {
        return this.userModel.countDocuments();
    }

    async update(data: any, userId: string) {
        return this.userModel.updateOne({ _id: userId }, data);
    }
}