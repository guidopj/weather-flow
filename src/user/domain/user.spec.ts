import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './user';

describe('User', () => {
  it('should subscribe to weather station', () => {
    const user = new User('A', 'B', 'a@mail.com');

    user.subscribe('WS1');

    expect(user.subscriptionAlerts).toContain('WS1');
  });

  it('should throw if already subscribed', () => {
    const user = new User('A', 'B', 'a@mail.com', ['WS1']);

    expect(() => user.subscribe('WS1')).toThrow(ConflictException);
  });

  it('should unsubscribe from station', () => {
    const user = new User('A', 'B', 'a@mail.com', ['WS1']);

    user.unsubscribe('WS1');

    expect(user.subscriptionAlerts).not.toContain('WS1');
  });

  it('should throw if not subscribed', () => {
    const user = new User('A', 'B', 'a@mail.com');

    expect(() => user.unsubscribe('WS1')).toThrow(NotFoundException);
  });
});
