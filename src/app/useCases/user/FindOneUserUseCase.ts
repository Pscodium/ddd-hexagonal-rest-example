import { inject, injectable } from 'tsyringe';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/shared/types/dependencies';

@injectable()
export class FindOneUserUseCase {
    constructor(
        @inject('UserRepository') private userRepository: Dependencies['IUserRepository'],
    ) {}

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError('User does not exist (Invalid ID).', 404);
        }

        return user;
    }
}