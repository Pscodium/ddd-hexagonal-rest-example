import Dependencies from '@/types/Dependencies';
import { Article } from '@/domain/entities/Article';

export class FindAllArticlesUseCase {
    private articleRepository: Dependencies['articleRepository'];
    private logger: Dependencies['logger'];
    constructor({ articleRepository, logger }: Pick<Dependencies, 'logger' | 'articleRepository'>) {
        this.articleRepository = articleRepository;
        this.logger = logger;
    }

    async execute(): Promise<Article[] | null> {
        const article = await this.articleRepository.findAll();

        return article ? article.map((a: Article) => new Article(a)) : null;
    }
}