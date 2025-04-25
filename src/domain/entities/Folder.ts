import { IFolderEntity } from "@/types/entity/FolderEntity";
import { File } from "./File";

export class Folder implements IFolderEntity {
    id: string;
    name: string;
    type: string;
    UserId: string;
    hex: string;
    private!: boolean;
    createdAt!: Date | number | undefined;
    updatedAt!: Date | number | undefined;
    filesCount!: number | undefined;
    Files!: File[] | undefined;

    constructor({ id, name, type, UserId, hex, private: isPrivate, filesCount, Files, createdAt, updatedAt }: IFolderEntity) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.UserId = UserId;
        this.hex = hex;
        this.private = isPrivate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.filesCount = filesCount;
        this.Files = Files;
    }
  
}