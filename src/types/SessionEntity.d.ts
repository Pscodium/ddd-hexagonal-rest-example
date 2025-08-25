export interface ISessionEntity {
    sessionId?: string;
    jwt: string | null;
    userId: string | undefined;
    expirationDate: number;
    origin: string | undefined;
}