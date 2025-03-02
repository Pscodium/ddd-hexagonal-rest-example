import { User } from '../entities/User';

export interface IUserRepository {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailOrNickname(login: string): Promise<User | null>;
    findById(id: string | undefined): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, user: Partial<User>): Promise<[affectedCount: number]>;
    delete(id: string): Promise<void>;
    nickExists(nickname: string): Promise<boolean>;
};