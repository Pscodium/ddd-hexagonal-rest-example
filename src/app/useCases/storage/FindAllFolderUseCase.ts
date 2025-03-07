import { Folder } from '@/domain/entities/Folder';
import Dependencies from '@/types/Dependencies';

export class FindAllFolderUseCase {
    private folderRepository: Dependencies['folderRepository'];
    private logger: Dependencies['logger'];
    constructor({ folderRepository, logger }: Pick<Dependencies, 'folderRepository' | 'logger'>) {
        this.folderRepository = folderRepository;
        this.logger = logger;
    }

    async execute(): Promise<Folder[]> {
        return await this.folderRepository.findAll();
    }
}