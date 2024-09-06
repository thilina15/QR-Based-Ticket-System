import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Admin, AdminSchema } from './admin/admin.schema';
import { User, UserSchema } from './user/user.schema';
import { AdminRepo } from './admin/admin.repo';
import { UserRepo } from './user/user.repo';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/qr-ticket'),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, AdminController, UserController],
  providers: [AppService, AdminService, UserService, AdminRepo, UserRepo],
})
export class AppModule { }
