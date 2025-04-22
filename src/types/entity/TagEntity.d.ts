import { IArticleEntity } from "./ArticleEntity";

export interface ITagEntity {
    id: string;
    title: string;
    count: number;
    views: number;
    hex: string;
    UserId: string;
    articlesCount?: number;
    Articles?: IArticleEntity[] | IArticleEntity;
    Article?: IArticleEntity;
    createdAt?: Date | number;
    updatedAt?: Date | number;
}