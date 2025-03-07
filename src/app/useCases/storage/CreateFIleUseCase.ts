import { File } from '@/domain/entities/File';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { CreateFileDTO } from '@/app/dto/storage/CreateFileDTO';

export class CreateFileUseCase {
    private fileRepository: Dependencies['fileRepository'];
    private folderRepository: Dependencies['folderRepository'];
    private logger: Dependencies['logger'];
    constructor({ fileRepository, folderRepository, logger }: Pick<Dependencies, 'fileRepository' | 'folderRepository' | 'logger'>) {
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.logger = logger;
    }

    async execute(data: CreateFileDTO): Promise<File | null> {
        const folderId = data.FolderId;

        if (!folderId) {
            this.logger.error('Folder id not found');
            throw new AppError('Folder id not found', 404);
        }
        const hasFolder = await this.folderRepository.findOne(folderId);

        if (!hasFolder) {
            this.logger.error('Folder entity not found');
            throw new AppError('Folder entity not found', 404);
        }

        const file = await this.fileRepository.create(data);

        if (!file) {
            this.logger.error('Unexpected error on create file');
            throw new AppError('Unexpected error on create file', 400);
        }

        return file;
    }
}