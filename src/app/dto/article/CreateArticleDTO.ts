export interface CreateArticleDTO {
    title: string;
    body: string;
    UserId: string;
    tags: {
        title: string;
    }[]
}