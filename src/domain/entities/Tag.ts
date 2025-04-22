import { ITagEntity } from "@/types/entity/TagEntity";
import { IArticleEntity } from "@/types/entity/ArticleEntity";

export class Tag implements ITagEntity {
    id!: string;
    title!: string;
    count!: number;
    views!: number;
    hex!: string;
    UserId!: string;
    articlesCount?: number | undefined;
    Article?: IArticleEntity;
    Articles?: IArticleEntity[] | IArticleEntity;
    updatedAt?: number | Date | undefined;
    createdAt?: number | Date | undefined;

    constructor({ id, title, count, views, hex, UserId, articlesCount, Article, Articles, updatedAt, createdAt }: ITagEntity) {
        this.id = id;
        this.title = title;
        this.count = count;
        this.views = views;
        this.hex = hex;
        this.UserId = UserId;
        this.articlesCount = articlesCount;
        this.Article = Article;
        this.Articles = Articles;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
  
}