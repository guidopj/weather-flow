import { ConflictException, NotFoundException } from '@nestjs/common';
import { Email } from './valueObjects/email';

export class User {
  constructor(
    public name: string,
    public surname: string,
    public email: Email,
    //IDs de estaciones de las cuales desea recibir alertas
    public subscriptionAlerts: Array<string> = [],
    public id?: string,
  ) {}

  subscribe(weatherStationId: string) {
    const alreadySubscribed =
      this.subscriptionAlerts.includes(weatherStationId);

    if (alreadySubscribed) {
      throw new ConflictException('Weather station already subscribed');
    }

    this.subscriptionAlerts.push(weatherStationId);
  }

  unsubscribe(weatherStationId: string) {
    const isSubscribed = this.subscriptionAlerts.includes(weatherStationId);

    if (!isSubscribed) {
      throw new NotFoundException('Weather station is not subscribed');
    }

    this.subscriptionAlerts = this.subscriptionAlerts.filter(
      (id) => id !== weatherStationId,
    );
  }
}
