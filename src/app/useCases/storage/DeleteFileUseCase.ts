import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class DeleteFileUseCase {
    private fileRepository: Dependencies['fileRepository'];
    private folderRepository: Dependencies['folderRepository'];
    private storageRepository: Dependencies['storageRepository'];
    private logger: Dependencies['logger'];
    constructor({
        fileRepository,
        folderRepository,
        storageRepository,
        logger,
    }: Pick<
        Dependencies,
        'fileRepository' | 'folderRepository' | 'storageRepository' | 'logger'
    >) {
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.storageRepository = storageRepository;
        this.logger = logger;
    }

    async execute(fileId: string, folderId: string): Promise<void> {
        const file = await this.fileRepository.findOne(fileId);
        const folder = await this.folderRepository.findOne(folderId);

        if (!file || !folder) {
            this.logger.error(`[REQUEST ERROR] - File or Folder not found`);
            throw new AppError('File or Folder not found', 404);
        }

        const hasFileOnFolder = await this.fileRepository.hasFileOnFolder(
            folderId,
            fileId,
        );

        if (!hasFileOnFolder) {
            this.logger.error('This file does not belong in this folder');
            throw new AppError('This file does not belong in this folder', 400);
        }

        await this.storageRepository.deleteFile(file.name, `${folder.name}/`);

        return await this.fileRepository.delete(fileId);
    }
}
