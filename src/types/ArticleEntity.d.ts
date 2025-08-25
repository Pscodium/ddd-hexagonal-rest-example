import { ITagEntity } from "./TagEntity";

export interface IArticleEntity {
    id: string;
    title: string;
    body: string;
    files: string[];
    private: boolean;
    UserId: string;
    Tag?: ITagEntity;
    Tags?: ITagEntity[] | ITagEntity;
    createdAt?: Date | number;
    updatedAt?: Date | number;
}