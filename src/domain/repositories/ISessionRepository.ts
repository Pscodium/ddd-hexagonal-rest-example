import { Session } from '../entities/Session';

export interface ISessionRepository {
    findOne(userId: string | undefined, origin: string | undefined): Promise<Session | null>;
    destroy(sessionId: string | undefined): Promise<void>;
    create(session: Session): Promise<Session>;
};