// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../user/domain/user-repository';
import { User } from '../domain/user';
import { PersistedUser } from '../domain/user.types';

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

  private toDomain(doc: UserDocument): PersistedUser {
    return new User(
      doc.name,
      doc.surname,
      doc.email,
      doc.subscriptionAlerts,
      doc._id.toString(),
    ) as PersistedUser;
  }

  async create(user: User): Promise<PersistedUser> {
    const doc = await this.model.create(this.toPersistence(user));

    const entity = this.toDomain(doc);

    if (!entity.id) {
      throw new Error('Invariant: id should exist after persistence');
    }

    return entity as PersistedUser;
  }

  async findById(id: string): Promise<PersistedUser | null> {
    const userDoc = await this.model.findById(id);

    if (!userDoc) return null;

    return this.toDomain(userDoc);
  }

  async update(id: string, user: User): Promise<User | null> {
    const doc = await this.model.findByIdAndUpdate(
      id,
      this.toPersistence(user),
      { new: true },
    );

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async delete(id: string): Promise<User | null> {
    return this.model.findByIdAndDelete(id);
  }

  async findBySubscribedStation(stationId: string): Promise<User[]> {
    const docs = await this.model.find({
      subscriptionAlerts: stationId,
    });

    return docs.map((doc) => this.toDomain(doc));
  }
}
