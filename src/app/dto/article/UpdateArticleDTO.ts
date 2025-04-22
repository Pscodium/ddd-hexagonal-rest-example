export interface UpdateArticleDTO {
    title: string;
    body: string;
    UserId: string;
    id: string;
    tags: {
        title: string;
    }[]
}
