import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { SequelizeUserModel } from '../orm/sequelize/models/SequelizeUserModel';
import { injectable } from 'tsyringe';

@injectable()
export class SequelizeUserRepository implements IUserRepository {
    async save(user: User): Promise<User> {
        const createdUser = await SequelizeUserModel.create({ name: user.name, email: user.email });
        return new User(createdUser.name, createdUser.email, createdUser.id);
    }

    async findById(id: number): Promise<User | null> {
        const user = await SequelizeUserModel.findByPk(id);
        return user ? new User(user.name, user.email, user.id) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await SequelizeUserModel.findAll();
        return users.map((u) => new User(u.name, u.email, u.id));
    }

    async update(id: number, user: Partial<User>): Promise<void> {
        await SequelizeUserModel.update(user, { where: { id } });
    }

    async delete(id: number): Promise<void> {
        await SequelizeUserModel.destroy({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await SequelizeUserModel.findOne({ where: { email }});
        return user;
    }
}