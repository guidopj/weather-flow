// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../user/domain/user-repository';
import { User } from '../domain/user';

type UserDocument = HydratedDocument<{
  name: string;
  surname: string;
  email: string;
  subscriptionAlerts: Array<string>;
}>;

@Injectable()
export class UserRepositoryMongo implements UserRepository {
  constructor(
    @InjectModel('User')
    private readonly model: Model<UserDocument>,
  ) {}

  private toPersistence(user: User) {
    return {
      name: user.name,
      surname: user.surname,
      email: user.email,
      subscriptionAlerts: user.subscriptionAlerts,
    };
  }

  async save(user: User): Promise<void> {
    await this.model.create(this.toPersistence(user));
  }

  private toDomain(doc: UserDocument): User {
    return new User(doc.name, doc.surname, doc.email, doc.subscriptionAlerts);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.model.findById(id);

    if (!userDoc) return null;

    return this.toDomain(userDoc);
  }

  async update(id: string, user: User): Promise<void> {
    await this.model.updateOne({ _id: id }, this.toPersistence(user));
  }

  async delete(id: string): Promise<User | null> {
    return this.model.findByIdAndDelete(id);
  }
}
