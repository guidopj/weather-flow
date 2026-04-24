import { User } from './user';
import { PersistedUser } from './user.types';

//PORT
export abstract class UserRepository {
  abstract create(weatherStation: User): Promise<PersistedUser>;
  abstract update(id: string, weatherStation: User): Promise<User | null>;
  abstract findById(id: string): Promise<PersistedUser | null>;
  abstract delete(id: string): Promise<User | null>;
  abstract findBySubscribedStation(stationId: string): Promise<User[]>;
}
