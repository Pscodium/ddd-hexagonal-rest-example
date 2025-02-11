import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class DeleteUserUseCase {
    private userRepository: Dependencies['userRepository'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, logger }: Pick<Dependencies, 'userRepository' | 'logger'>) {
        this.userRepository = userRepository;
        this.logger = logger;
    }

    async execute(id: string): Promise<void> {
        const userExists = await this.userRepository.findById(id);

        if (!userExists) {
            this.logger.warn('The user you are trying to delete does not exist.');
            throw new AppError('The user you are trying to delete does not exist.', 404);
        }

        await this.userRepository.delete(id);
    }
}