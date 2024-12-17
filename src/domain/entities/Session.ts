import { SessionEntity } from "@/types/entity/SessionEntity";

export class Session implements SessionEntity {
    expirationDate: number;
    jwt: string | null;
    origin: string | undefined;
    sessionId?: string;
    userId: string | undefined | null;

    constructor({ expirationDate, jwt, origin, sessionId, userId }: SessionEntity) {
        this.expirationDate = expirationDate;
        this.jwt = jwt;
        this.origin = origin;
        this.sessionId = sessionId;
        this.userId = userId;
    }
  
}