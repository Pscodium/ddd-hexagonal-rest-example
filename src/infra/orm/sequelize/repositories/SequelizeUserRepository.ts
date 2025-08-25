import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { SequelizeUserModel } from '../models/SequelizeUserModel';
import { Op } from 'sequelize';
import { SequelizePermissionModel } from '../models/SequelizePermissionModel';

export class SequelizeUserRepository implements IUserRepository {
    async save(user: User): Promise<User> {
        try {
            const permissions = await SequelizePermissionModel.create();
            const createdUser = await SequelizeUserModel.create({ 
                firstName: user.firstName, 
                lastName: user.lastName, 
                nickname: user.nickname, 
                email: user.email, 
                password: user.password,
                permissionId: permissions.id
            });
            permissions.userId = createdUser.id;
            await permissions.save();
            const userReturn = await this.findById(createdUser.id);
            
            return userReturn ? new User(userReturn) : new User(createdUser);
        } catch (err) {
            console.log('error ', err);
            return new User({} as User);
        }
        
    }

    async findById(id: string): Promise<User | null> {
        const user = await SequelizeUserModel.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['password'],
            },
            include: {
                model: SequelizePermissionModel,
                as: 'Permission',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'id', 'userId']
                }
            }
        });

        return user ? new User(user.toJSON()) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await SequelizeUserModel.findAll({
            attributes: {
                exclude: ['password']
            }
        });
        return users ? users.map((u) => new User(u)) : [];
    }

    async update(id: string, user: Partial<User>): Promise<[affectedCount: number]> {
        return await SequelizeUserModel.update(user, { where: { id } });
    }

    async delete(id: string): Promise<void> {
        await SequelizeUserModel.destroy({ where: { id }, cascade: true });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await SequelizeUserModel.findOne({ where: { email }});
        return user ? new User(user.toJSON()) : null;
    }

    async findByEmailOrNickname(login: string | undefined | null): Promise<User | null> {
        const user = await SequelizeUserModel.findOne({ where: {[Op.or]: [{ email: login }, { nickname: login }]}});
        return user ? new User(user.toJSON()) : null;
    }

    async nickExists(nickname: string): Promise<boolean> {
        try {
            const user = await SequelizeUserModel.findOne({ where: { nickname }});

            if (!user) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }
}