export interface CreateFileDTO {
    name: string;
    file: Express.Multer.File
    UserId?: string;
    FolderId?: string;
    private?: boolean;
}