export interface CreateFileDTO {
    name: string;
    type: string;
    url: string;
    UserId?: string;
    folderId?: string;
    private?: boolean;
}