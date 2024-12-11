import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/shared/types/Dependencies';

export class FindOneUserUseCase {
    private userRepository: Dependencies['userRepository'];
    constructor({ userRepository }: Pick<Dependencies, 'userRepository'>) {
        this.userRepository = userRepository;
    }

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError('User does not exist (Invalid ID).', 404);
        }

        return user;
    }
}