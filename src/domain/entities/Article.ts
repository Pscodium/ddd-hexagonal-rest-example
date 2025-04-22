import { IArticleEntity } from "@/types/entity/ArticleEntity";
import { ITagEntity } from "@/types/entity/TagEntity";

export class Article implements IArticleEntity {
    id!: string;
    title!: string;
    body!: string;
    files!: string[];
    private!: boolean;
    UserId!: string;
    Tag?: ITagEntity | undefined;
    Tags?: ITagEntity[]| ITagEntity;
    updatedAt?: number | Date | undefined;
    createdAt?: number | Date | undefined;

    constructor({ id, title, body, files, private: privateProp, UserId, Tags, Tag, updatedAt, createdAt }: IArticleEntity) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.files = files;
        this.private = privateProp;
        this.UserId = UserId;
        this.Tags = Tags;
        this.Tag = Tag;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
  
}