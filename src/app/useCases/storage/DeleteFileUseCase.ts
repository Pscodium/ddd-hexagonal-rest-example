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
        const folderExists = await this.folderRepository.findOne(folderId);

        if (!fileExists || !folderExists) {
            this.logger.error('File or Folder not found');
            throw new AppError('File of Folder not found', 404);
        }

        return await this.fileRepository.delete(fileId, folderId);
    }
}