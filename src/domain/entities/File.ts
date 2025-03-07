import { IFileEntity } from "@/types/entity/FileEntity";
import { Folder } from "aws-sdk/clients/storagegateway";

export class File implements IFileEntity {
    id!: string;
    name!: string;
    url!: string;
    type!: string;
    private!: boolean;
    createdAt!: Date | number | undefined;
    updatedAt!: Date | number | undefined;
    UserId!: string;
    Folder!: Folder[] | undefined;

    constructor({ id, name, type, url, UserId, private: isPrivate, Folder, createdAt, updatedAt }: IFileEntity) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.url = url;
        this.UserId = UserId;
        this.private = isPrivate;
        this.Folder = Folder;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
  
}