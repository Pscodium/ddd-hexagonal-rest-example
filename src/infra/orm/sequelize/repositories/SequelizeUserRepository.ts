import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { SequelizeUserModel } from '../models/SequelizeUserModel';
import bcrypt from 'bcrypt';

export class SequelizeUserRepository implements IUserRepository {
    async save(user: User): Promise<User> {

        user.password = bcrypt.hashSync(user.password, 8);

        const createdUser = await SequelizeUserModel.create({ 
            firstName: user.firstName, 
            lastName: user.lastName, 
            nickname: user.nickname, 
            email: user.email, 
            password: user.password 
        });
        return new User(createdUser);
    }

    async findById(id: string): Promise<User | null> {
        const user = await SequelizeUserModel.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });
        return user ? new User(user) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await SequelizeUserModel.findAll();
        return users.map((u) => new User(u));
    }

    async update(id: string, user: Partial<User>): Promise<void> {
        await SequelizeUserModel.update(user, { where: { id } });
    }

    async delete(id: string): Promise<void> {
        await SequelizeUserModel.destroy({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await SequelizeUserModel.findOne({ where: { email }});
        return user;
    }
}