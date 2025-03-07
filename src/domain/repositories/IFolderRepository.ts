import { Folder } from "../entities/Folder";

export interface IFolderRepository {
    create(data: Partial<Folder>): Promise<Folder | null>;
    findAll(): Promise<Folder[]>;
    findOne(folderId: string): Promise<Folder | null>
    delete(folderId: string): Promise<void>;
};