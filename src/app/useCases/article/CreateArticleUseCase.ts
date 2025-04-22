import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { CreateArticleDTO } from '@/app/dto/article/CreateArticleDTO';
import { Article } from '@/domain/entities/Article';
import randomColor from 'randomcolor';

export class CreateArticleUseCase {
    private articleRepository: Dependencies['articleRepository'];
    private tagRepository: Dependencies['tagRepository'];
    private logger: Dependencies['logger'];
    constructor({ articleRepository, tagRepository, logger }: Pick<Dependencies, 'logger' | 'articleRepository' | 'tagRepository'>) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.logger = logger;
    }

    async execute(data: CreateArticleDTO): Promise<Article | null> {
        const article = await this.articleRepository.create({
            title: data.title,
            body: data.body,
            UserId: data.UserId
        });

        if (!article) {
            throw new AppError('Error on create article ', 400);
        }

        if (data.tags) {
            const tags = data.tags;
            for (let i = 0; i < tags.length; i++) {
                if (!tags[i].title) {
                    continue;
                }
                const tagExists = await this.tagRepository.findOne(tags[i].title);
                if (tagExists) {
                    await this.tagRepository.addArticleAndCount({...tagExists, Article: article });
                } else {
                    await this.tagRepository.create({
                        title: tags[i].title,
                        hex: randomColor(),
                        Article: article,
                        UserId: data.UserId
                    });
                }
            }
        }

        const responseArticle = await this.articleRepository.findOne(article.id);

        return responseArticle;
    }
}