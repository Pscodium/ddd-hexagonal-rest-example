import { File } from "@/domain/entities/File";

export interface IFolderEntity {
    id: string;
    name: string;
    hex: string;
    type: string;
    private: boolean;
    UserId: string;
    createdAt?: Date | number;
    updatedAt?: Date | number;
    filesCount?: number;
    Files?: File[];
}