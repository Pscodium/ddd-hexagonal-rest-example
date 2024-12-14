import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class FindOneUserUseCase {
    private userRepository: Dependencies['userRepository'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, logger }: Pick<Dependencies, 'userRepository' | 'logger'>) {
        this.userRepository = userRepository;
        this.logger = logger;
    }

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            this.logger.error('User does not exist (Invalid ID).');
            throw new AppError('User does not exist (Invalid ID).', 404);
        }
        return user;
    }
}