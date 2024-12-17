import { Session } from "@/domain/entities/Session";
import { ISessionRepository } from "@/domain/repositories/ISessionRepository";
import { SequelizeSessionModel } from "../models/SequelizeSessionModel";
import { AppError } from "@/shared/errors/AppError";

export class SequelizeSessionRepository implements ISessionRepository {
    async findOne(userId: string | undefined, origin: string): Promise<Session | null> {
        try {
            const session = await SequelizeSessionModel.findOne({
                where: {
                    userId,
                    origin
                }
            });
    
            return session ? new Session(session) : null;
        } catch (err) {
            throw new AppError(`Origin or UserId undefined - stack: ${err}`, 500);
        }
    }

    async destroy(sessionId: string | undefined): Promise<void> {
        await SequelizeSessionModel.destroy({ where: { sessionId }});
    }

    async create(session: Session): Promise<Session> {
        try {
            const createdSession = await SequelizeSessionModel.create({
                sessionId: session.sessionId,
                jwt: session.jwt,
                origin: session.origin,
                expirationDate: session.expirationDate,
                userId: session.userId
            });
            return new Session(createdSession);
        } catch (err) {
            throw new AppError(`Unexpected error on create a session - stack: ${err} `, 500);
        }
    }
}