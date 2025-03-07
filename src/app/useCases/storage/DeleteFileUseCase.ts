import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class DeleteFileUseCase {
    private fileRepository: Dependencies['fileRepository'];
    private folderRepository: Dependencies['folderRepository'];
    private logger: Dependencies['logger'];
    constructor({ fileRepository, folderRepository, logger }: Pick<Dependencies, 'fileRepository' | 'folderRepository' | 'logger'>) {
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.logger = logger;
    }

    async execute(fileId: string, folderId: string): Promise<void> {
        const fileExists = await this.fileRepository.findOne(fileId);

        if (!fileExists) {
            this.logger.error('File not found');
            throw new AppError('File not found', 404);
        }

        const hasFileOnFolder = await this.fileRepository.hasFileOnFolder(folderId, fileId);

        if (!hasFileOnFolder) {
            this.logger.error('This file does not belong in this folder');
            throw new AppError('This file does not belong in this folder', 400);
        }

        return await this.fileRepository.delete(fileId);
    }
}