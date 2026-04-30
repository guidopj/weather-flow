export class AlertTriggeredException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlertTriggeredException';
  }
}