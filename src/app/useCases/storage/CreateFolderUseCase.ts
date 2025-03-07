import { CreateFolderDTO } from '@/app/dto/storage/CreateFolderDTO';
import { Folder } from '@/domain/entities/Folder';
import Dependencies from '@/types/Dependencies';

export class CreateFolderUseCase {
    private folderRepository: Dependencies['folderRepository'];
    private logger: Dependencies['logger'];
    constructor({ folderRepository, logger }: Pick<Dependencies, 'folderRepository' | 'logger'>) {
        this.folderRepository = folderRepository;
        this.logger = logger;
    }

    async execute(data: CreateFolderDTO): Promise<Folder | null> {
        return await this.folderRepository.create(data);
    }
}