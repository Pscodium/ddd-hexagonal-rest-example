import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { UpdateArticleDTO } from '@/app/dto/article/UpdateArticleDTO';
import { Article } from '@/domain/entities/Article';
import randomColor from 'randomcolor';

export class UpdateArticleUseCase {
    private articleRepository: Dependencies['articleRepository'];
    private tagRepository: Dependencies['tagRepository'];
    private logger: Dependencies['logger'];
    constructor({ articleRepository, tagRepository, logger }: Pick<Dependencies, 'logger' | 'articleRepository' | 'tagRepository'>) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.logger = logger;
    }

    async execute(data: UpdateArticleDTO): Promise<Article | null> {
        const article = await this.articleRepository.update({
            title: data.title,
            body: data.body,
            id: data.id,
            UserId: data.UserId
        });

        if (!article) {
            throw new AppError('Error on update article ', 400);
        }

        if (data.tags) {
            const tags = data.tags;
            const articleTags = await this.tagRepository.findTagsByArticleId(data.id);
            const tagsTitle = tags?.map(tag => tag.title);
            const articleTagsTitle = articleTags?.map(tag => tag.title);

            const tagsToRemove = articleTags?.filter((item) => !tagsTitle?.includes(item.title));
            const tagsToAdd = tags.filter((item) => !articleTagsTitle?.includes(item.title));

            // console.log('Tags Payload ', tags);
            // console.log('Tags in article ', articleTags);

            // console.log('Tags para Remover: ', tagsToRemove);
            // console.log('Tags para Adicionar: ', tagsToAdd);

            if (tagsToRemove && tagsToRemove.length) {
                for (let i = 0; i < tagsToRemove.length; i++) {
                    const dissociateTags = await this.tagRepository.dissociateTagFromArticle(data.id, tagsToRemove[i].id);
                    if (!dissociateTags) {
                        throw new AppError('Error on dissociate tags from article', 400);
                    }
                }
            }

            if (tagsToAdd.length) {
                for (let i = 0; i < tagsToAdd.length; i++) {
                    if (!tagsToAdd[i].title) {
                        continue;
                    }
                    const tagExists = await this.tagRepository.findOne(tagsToAdd[i].title);
                    if (tagExists) {
                        await this.tagRepository.addArticleAndCount({...tagExists, Article: article });
                    } else {
                        await this.tagRepository.create({
                            title: tagsToAdd[i].title,
                            hex: randomColor(),
                            Article: article,
                            UserId: data.UserId
                        });
                    }
                }
            }
        }

        const responseArticle = await this.articleRepository.findOne(data.id);

        return responseArticle;
    }
}