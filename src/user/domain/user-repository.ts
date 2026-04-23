import { User } from "./user";

//PORT
export abstract class UserRepository {
  abstract save(weatherStation: User): Promise<void>
  abstract update(id: string, weatherStation: User): Promise<void>
  abstract findById(id: string): Promise<User | null>
  abstract delete(id: string): Promise<User | null>
}