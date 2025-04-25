import { File } from '@/domain/entities/File';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { CreateFileDTO } from '@/app/dto/storage/CreateFileDTO';

export class CreateFileUseCase {
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

        const fileUrl = await this.storageRepository.uploadFile(
            data.file.originalname,
            data.file.buffer,
            `${hasFolder.name}/`,
        );

        if (!fileUrl) {
            this.logger.error(`[MINIO] - Failed to upload`);
            throw new AppError('[MINIO] - Failed to upload', 500);
        }

        const file = await this.fileRepository.create({
            name: data.name,
            type: data.file.mimetype,
            url: fileUrl,
            UserId: data.UserId,
            FolderId: data.FolderId,
        });

        if (!file) {
            this.logger.error('Unexpected error on create file');
            throw new AppError('Unexpected error on create file', 400);
        }

        return file;
    }
}
