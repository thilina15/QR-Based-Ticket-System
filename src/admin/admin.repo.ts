import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "./admin.schema";
import { LoginDto } from "./admin.dto";

@Injectable()
export class AdminRepo {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>
    ) { }

    async create(data: any) {
        const admin = new this.adminModel(data);
        return admin.save();
    }

    async findOne(data: any) {
        return this.adminModel.findOne(data);
    }
}