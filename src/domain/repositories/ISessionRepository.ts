import { Session } from '../entities/Session';

export interface ISessionRepository {
    findOne(token: string): Promise<Session | null>;
    destroy(sessionId: string | undefined): Promise<void>;
    create(session: Session): Promise<Session>;
    destroyByUserIdAndOrigin(userId: string, origin: string): Promise<number>;
    destroyByToken(token: string ): Promise<number>;
    findOneByUserId(userId: string | undefined, origin: string | undefined): Promise<Session | null>;
};