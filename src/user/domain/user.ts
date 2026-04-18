export class User {
  constructor(
    public readonly id: string | null,
    public name: string,
    public surname: string,
    public email: string,
    //IDs de estaciones de las cuales desea recibir alertas
    public subscriptionAlerts: Array<string> = [],
  ) {}

  subscribe(weatherStationId: string) {
    const alreadySubscribed = this.subscriptionAlerts.includes(weatherStationId);

    if (alreadySubscribed) {
      throw new Error('Weather station already subscribed');
    }

    this.subscriptionAlerts.push(weatherStationId);
  }

  unsubscribe(weatherStationId: string) {
    const isSubscribed = this.subscriptionAlerts.includes(weatherStationId);

    if (!isSubscribed) {
      throw new Error('Weather station is not subscribed');
    }

    this.subscriptionAlerts =
      this.subscriptionAlerts.filter(id => id !== weatherStationId);
  }
}
