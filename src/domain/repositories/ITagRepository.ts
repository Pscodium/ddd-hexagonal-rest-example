import { Tag } from "../entities/Tag";

export interface ITagRepository {
    create(data: Partial<Tag>): Promise<Tag | null>;
    findOne(title?: string): Promise<Tag | null>;
    findById(tagId: string): Promise<Tag | null>;
    findAll(): Promise<Tag[] | null>;
    addArticleAndCount(data: Partial<Tag>): Promise<Tag | null>;
    dissociateTagFromArticle(articleId: string, tagId: string): Promise<boolean | null>
    findTagsByArticleId(articleId: string): Promise<Tag[] | null>;
    removeArticle(tagId: string, articleId: string): Promise<boolean | null>
    delete(id: string): Promise<boolean | null>
};