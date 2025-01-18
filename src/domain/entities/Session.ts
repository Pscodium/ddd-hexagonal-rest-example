import { ISessionEntity } from "@/types/entity/SessionEntity";

export class Session implements ISessionEntity {
    expirationDate: number;
    jwt: string | null;
    origin: string | undefined;
    sessionId?: string;
    userId: string | undefined;

    constructor({ expirationDate, jwt, origin, sessionId, userId }: ISessionEntity) {
        this.expirationDate = expirationDate;
        this.jwt = jwt;
        this.origin = origin;
        this.sessionId = sessionId;
        this.userId = userId;
    }
  
}