import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../domain/user';
import { CreateUserDto } from '../create-user.dto';
import { UpdateUserDto } from '../update-user.dto';
import { UserRepository } from '../domain/user-repository';
import { Email } from '../domain/valueObjects/email';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(input: CreateUserDto) {
      const email = Email.create(input.email);

    const newUser = new User(input.name, input.surname, email, []);

    await this.userRepository.create(newUser);

    return newUser;
  }

  async update(userId: string, input: UpdateUserDto) {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (input.name) user.name = input.name;
    if (input.surname) user.surname = input.surname;
    if (input.email) user.email = Email.create(input.email);
    if (input.subscriptionAlerts)
      user.subscriptionAlerts = input.subscriptionAlerts;

    await this.userRepository.update(userId, user);

    return user;
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }

  async subscribe(userId: string, weatherStationId: string) {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.subscribe(weatherStationId);

    await this.userRepository.update(userId, user);

    return user;
  }

  async unsubscribe(userId: string, weatherStationId: string) {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isSubscribed = user.subscriptionAlerts.includes(weatherStationId);

    if (!isSubscribed) {
      throw new NotFoundException('Weather station is not subscribed');
    }

    user.unsubscribe(weatherStationId);

    await this.userRepository.update(userId, user);

    return user;
  }
}
