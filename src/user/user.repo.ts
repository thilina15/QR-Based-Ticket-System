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

    async findOne(data: any) {
        return this.userModel.findOne(data);
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
}