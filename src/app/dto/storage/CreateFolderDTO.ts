export interface CreateFolderDTO {
    name: string;
    type: string;
    hex: string;
    UserId?: string;
    private?: boolean;
}