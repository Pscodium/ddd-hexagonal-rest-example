import { CreateFolderDTO } from '@/app/dto/storage/CreateFolderDTO';
import { Folder } from '@/domain/entities/Folder';
import Dependencies from '@/types/Dependencies';

export class CreateFolderUseCase {
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

    async execute(data: CreateFolderDTO): Promise<Folder | null> {
        const validFolderName = `${data.name}/`;
        await this.storageRepository.createFolder(validFolderName);

        return await this.folderRepository.create(data);
    }
}
