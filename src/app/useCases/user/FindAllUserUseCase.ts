import { User } from '@/domain/entities/User';
import Dependencies from '@/types/Dependencies';

export class FindAllUserUseCase {
    private userRepository: Dependencies['userRepository'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, logger }: Pick<Dependencies, 'userRepository' | 'logger'>) {
        this.userRepository = userRepository;
        this.logger = logger;
    }

    async execute(): Promise<User[]> {
        const users = await this.userRepository.findAll();

        return users;
    }
}