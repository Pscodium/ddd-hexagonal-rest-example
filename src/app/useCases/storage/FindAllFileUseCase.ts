import { File } from '@/domain/entities/File';
import Dependencies from '@/types/Dependencies';

export class FindAllFileUseCase {
    private fileRepository: Dependencies['fileRepository'];
    private logger: Dependencies['logger'];
    constructor({
        fileRepository,
        logger,
    }: Pick<Dependencies, 'fileRepository' | 'logger'>) {
        this.fileRepository = fileRepository;
        this.logger = logger;
    }

    async execute(): Promise<File[]> {
        return await this.fileRepository.findAll();
    }
}
