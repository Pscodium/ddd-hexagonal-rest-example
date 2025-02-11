import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { UpdatePermissionDTO } from '@/app/dto/permission/UpdatePermissionDTO';

export class UpdatePermissionUseCase {
    private userRepository: Dependencies['userRepository'];
    private permissionRepository: Dependencies['permissionRepository'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, permissionRepository, logger }: Pick<Dependencies, 'userRepository' | 'permissionRepository' | 'logger'>) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.logger = logger;
    }

    async execute(data: UpdatePermissionDTO): Promise<number> {
        const userExists = await this.userRepository.findById(data.userId);

        if (!userExists) {
            this.logger.error('User not found');
            throw new AppError('User not found', 404);
        }

        return (await this.permissionRepository.updateUserPermission(data))[0];
    }
}