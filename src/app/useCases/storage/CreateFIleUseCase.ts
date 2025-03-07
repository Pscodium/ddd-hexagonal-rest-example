import { File } from '@/domain/entities/File';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { CreateFileDTO } from '@/app/dto/storage/CreateFileDTO';

export class CreateFileUseCase {
    private fileRepository: Dependencies['fileRepository'];
    private logger: Dependencies['logger'];
    constructor({ fileRepository, logger }: Pick<Dependencies, 'fileRepository' | 'logger'>) {
        this.fileRepository = fileRepository;
        this.logger = logger;
    }

    async execute(data: CreateFileDTO): Promise<File | null> {
        const folderId = data.folderId;
        delete data.folderId;

        if (!folderId) {
            this.logger.error('Folder id not found');
            throw new AppError('Folder id not found', 404);
        }

        const file = await this.fileRepository.create(data);

        if (!file) {
            this.logger.error('Unexpected error on create file');
            throw new AppError('Unexpected error on create file', 400);
        }
        await this.fileRepository.associateWithFolder(file.id, folderId);

        return file;
    }
}