import { Injectable } from '@nestjs/common';


import { User } from '../domain/user';
import { CreateUserDto } from '../create-user.dto';
import { UpdateUserDto } from '../update-user.dto';
import { UserRepository } from '../domain/user-repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async create(input: CreateUserDto) {
    
    const newUser = new User(
      input.name,
      input.surname,
      input.email,
      input.subscriptionAlerts,
    );

    
    await this.repo.save(newUser);

    return newUser;
  }

  async update(userId: string, input: UpdateUserDto) {
    const user: User | null = await this.repo.findById(userId);
    if (!user) throw new Error('User not found');

    if (input.name) user.name = input.name;
    if (input.surname) user.surname = input.surname;
    if (input.email) user.email = input.email;
    if (input.subscriptionAlerts)
      user.subscriptionAlerts = input.subscriptionAlerts;

    await this.repo.update(userId, user);

    return user;
  }

  async delete(id: string) {
    await this.repo.delete(id)
  }

  async subscribe(userId: string, weatherStationId: string) {
    const user: User | null = await this.repo.findById(userId);
    if (!user) throw new Error('User not found');

    const isSubscribed = user.subscriptionAlerts.includes(weatherStationId);

    if (isSubscribed) {
      throw new Error('Weather station is already subscribed');
    }

    user.subscribe(weatherStationId);


    await this.repo.update(userId, user);

    return user;
  }

  async unsubscribe(userId: string, weatherStationId: string) {
    const user: User | null = await this.repo.findById(userId);
    if (!user) throw new Error('User not found');

    const isSubscribed = user.subscriptionAlerts.includes(weatherStationId);

    if (!isSubscribed) {
      throw new Error('Weather station is not subscribed');
    }

    user.unsubscribe(weatherStationId);

    await this.repo.update(userId, user);

    return user;
  }
}
