import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class DeleteTagUseCase {
    private tagRepository: Dependencies['tagRepository'];
    private logger: Dependencies['logger'];
    private articleRepository: Dependencies['articleRepository'];

    constructor({ tagRepository, logger, articleRepository }: Pick<Dependencies, 'logger' | 'tagRepository' | 'articleRepository'>) {
        this.tagRepository = tagRepository;
        this.articleRepository = articleRepository;
        this.logger = logger;
    }

    async execute(id: string): Promise<boolean | null> {
        const tag = await this.tagRepository.findById(id); 

        if (!tag) {
            return false;
        }

        const articles = tag.Articles ?? [];

        if (!Array.isArray(articles)) {
            throw new AppError('Articles should be an array', 400);
        }


        articles.forEach(async (article) => {
            const completeArticle = await this.articleRepository.findOne(article.id);

            if (completeArticle?.Tags && Array.isArray(completeArticle?.Tags) && completeArticle?.Tags.length === 1) {
                await this.articleRepository.destroy(article.id);
            } else {
                await this.tagRepository.removeArticle(id, article.id);
            }
        });

        return await this.tagRepository.delete(id);
    }
}