import { User } from '../entities/User';

export interface IUserRepository {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: number, user: Partial<User>): Promise<void>;
    delete(id: number): Promise<void>;
};