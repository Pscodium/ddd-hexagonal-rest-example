import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

@injectable()
export class GetUserById {
    constructor(
        @inject('UserRepository') private userRepository: IUserRepository,
    ) {}

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError('User does not exist (Invalid ID).', 404);
        }

        return user;
    }
}