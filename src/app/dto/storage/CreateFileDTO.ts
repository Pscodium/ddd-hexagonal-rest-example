export interface CreateFileDTO {
    name: string;
    type: string;
    url: string;
    UserId?: string;
    FolderId?: string;
    private?: boolean;
}