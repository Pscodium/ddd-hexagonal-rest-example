import { Article } from "../entities/Article";

export interface IArticleRepository {
    create(data: Partial<Article>): Promise<Article | null>;
    findOne(id: string): Promise<Article | null>;
    findById(id: string): Promise<Article | null>;
    findAll(): Promise<Article[] | null>;
    update(data: Partial<Article>): Promise<Article | null>;
    delete(id: string): Promise<boolean | null>;
    destroy(id: string): Promise<boolean | null>;
    getArticlesByTagId(tagId: string): Promise<Article[] | null>;
};