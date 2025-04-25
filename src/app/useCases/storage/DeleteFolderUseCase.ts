import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class DeleteFolderUseCase {
    private folderRepository: Dependencies['folderRepository'];
    private storageRepository: Dependencies['storageRepository'];
    private logger: Dependencies['logger'];
    constructor({
        folderRepository,
        storageRepository,
        logger,
    }: Pick<
        Dependencies,
        'folderRepository' | 'storageRepository' | 'logger'
    >) {
        this.folderRepository = folderRepository;
        this.storageRepository = storageRepository;
        this.logger = logger;
    }

    async execute(folderId: string): Promise<void> {
        const folderExists = await this.folderRepository.findOne(folderId);

        if (!folderExists) {
            this.logger.error('Folder not found');
            throw new AppError('Folder not found', 404);
        }

        await this.folderRepository.delete(folderId);
        await this.storageRepository.deleteFolder(`${folderExists.name}/`);

        return;
    }
}
