export interface SessionEntity {
    sessionId?: string;
    jwt: string | null;
    userId: string | undefined | null;
    expirationDate: number;
    origin: string | undefined;
}