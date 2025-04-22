import Dependencies from '@/types/Dependencies';
import { Tag } from '@/domain/entities/Tag';

export class FindAllTagsUseCase {
    private tagRepository: Dependencies['tagRepository'];
    private logger: Dependencies['logger'];

    constructor({ tagRepository, logger }: Pick<Dependencies, 'logger' | 'tagRepository'>) {
        this.tagRepository = tagRepository;
        this.logger = logger;
    }

    async execute(): Promise<Tag[] | null> {
        const tag = await this.tagRepository.findAll();

        return tag ? tag.map((t: Tag) => new Tag(t)) : null;
    }
}