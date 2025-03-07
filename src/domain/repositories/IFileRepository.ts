import { File } from "../entities/File";

export interface IFileRepository {
    create(data: Partial<File>): Promise<File | null>;
    findOne(fileId: string): Promise<File | null>
    associateWithFolder(fileId: string, folderId: string): Promise<void>;
    findAll(): Promise<File[]>;
    delete(fileId: string, folderId: string): Promise<void>;
};