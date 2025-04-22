import Dependencies from '@/types/Dependencies';

export class DeleteArticleUseCase {
    private articleRepository: Dependencies['articleRepository'];
    private logger: Dependencies['logger'];
    constructor({ articleRepository, logger }: Pick<Dependencies, 'logger' | 'articleRepository'>) {
        this.articleRepository = articleRepository;
        this.logger = logger;
    }

    async execute(id: string): Promise<boolean | null> {
        return await this.articleRepository.delete(id); 
    }
}