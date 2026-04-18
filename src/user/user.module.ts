import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from '../user/domain/user-repository';
import { UserRepositoryMongo } from './infrastructure/user.repository.mongo';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/user.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: "User", schema: UserSchema },
      ]),
    ],
  controllers: [UserController],
  providers: [
      UserService,
      {
        provide: UserRepository,
        useClass: UserRepositoryMongo,
      },
    ],
})
export class UserModule {}
