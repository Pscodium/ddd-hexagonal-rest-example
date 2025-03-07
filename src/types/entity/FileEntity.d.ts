export interface IFileEntity {
    id: string;
    name: string;
    url: string;
    type: string;
    createdAt?: Date | number;
    updatedAt?: Date | number;
    private: boolean;
    UserId: string;
    FolderId?: string;
    Folder?: Folder[];
}