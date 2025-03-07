import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class DeleteFolderUseCase {
    private folderRepository: Dependencies['folderRepository'];
    private logger: Dependencies['logger'];
    constructor({ folderRepository, logger }: Pick<Dependencies, 'folderRepository' | 'logger'>) {
        this.folderRepository = folderRepository;
        this.logger = logger;
    }

    async execute(folderId: string): Promise<void> {
        const folderExists = await this.folderRepository.findOne(folderId);

        if (!folderExists) {
            this.logger.error('Folder not found');
            throw new AppError('Folder not found', 404);
        }

        return await this.folderRepository.delete(folderId);
    }
}