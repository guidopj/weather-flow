import { Injectable } from '@nestjs/common';


import { User } from '../domain/user';
import { CreateUserDto } from '../create-user.dto';
import { UpdateUserDto } from '../update-user.dto';
import { UserRepository } from '../domain/user-repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(input: CreateUserDto) {
    // 1. crear entidad de dominio
    const newUser = new User(
      '',
      input.name,
      input.surname,
      input.email,
      input.subscriptionAlerts,
    );

    // 2. persistir usando puerto
    await this.repo.save(newUser);

    return newUser;
  }

  async updateUser(id: string, input: UpdateUserDto) {
    const user: User | null = await this.repo.findById(id);
    if (!user) throw new Error('User not found');

    // aplicar cambios (sin romper dominio)
    if (input.name) user.name = input.name;
    if (input.surname) user.surname = input.surname;
    if (input.email) user.email = input.email;
    if (input.subscriptionAlerts)
      user.subscriptionAlerts = input.subscriptionAlerts;

    await this.repo.update(user);

    return user;
  }

  async deleteUser(id: string) {
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


    await this.repo.update(user);

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

    await this.repo.update(user);

    return user;
  }
}
