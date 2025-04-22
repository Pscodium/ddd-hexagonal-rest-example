import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { Article } from '@/domain/entities/Article';

export class FindArticlesByTagIdUseCase {
    private articleRepository: Dependencies['articleRepository'];
    private logger: Dependencies['logger'];

    constructor({ articleRepository, logger }: Pick<Dependencies, 'logger' | 'articleRepository' >) {
        this.articleRepository = articleRepository;
        this.logger = logger;
    }

    async execute(id: string): Promise<Article[] | null> {
        const articles = await this.articleRepository.getArticlesByTagId(id);

        if (!articles) {
            throw new AppError('Tag not found', 404);
        }

        return articles;
    }
}