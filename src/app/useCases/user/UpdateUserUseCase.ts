import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { UpdateUserDTO } from '@/app/dto/user/UpdateUserDTO';

export class UpdateUserUseCase {
    private userRepository: Dependencies['userRepository'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, logger }: Pick<Dependencies, 'userRepository' | 'permissionRepository' | 'logger'>) {
        this.userRepository = userRepository;
        this.logger = logger;
    }

    async execute(data: UpdateUserDTO): Promise<number> {
        const userExists = await this.userRepository.findById(data.id);
        console.log('entra aqui no use case ', data);

        if (!userExists || !userExists.id) {
            this.logger.error('User not found');
            throw new AppError('User not found', 404);
        }

        return (await this.userRepository.update(userExists.id, data))[0];
    }
}