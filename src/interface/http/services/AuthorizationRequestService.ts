import { Session } from '@/domain/entities/Session';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { Request, Response } from 'express';

export class AuthorizationRequestService {
    private userRepository: Dependencies['userRepository'];
    private sessionRepository: Dependencies['sessionRepository'];
    private logger: Dependencies['logger'];
    private environment: Dependencies['environment'];

    constructor({
        userRepository,
        sessionRepository,
        logger,
        environment,
    }: Pick<
        Dependencies,
        'userRepository' | 'sessionRepository' | 'logger' | 'environment'
    >) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.logger = logger;
        this.environment = environment;
    }

    async validateSession(token: string): Promise<Session> {
        const session = await this.sessionRepository.findOne(token);

        if (!session) {
            throw new AppError('Invalid SessionId', 401);
        }

        return new Session(session);
    }

    async getAuthenticatedUser(userId: string | undefined): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError('Invalid user id.', 401);
        }

        return new User(user);
    }

    async checkAuth(req: Request, res: Response): Promise<User> {
        if (!req.user) {
            res.clearCookie('token', {
                domain: this.environment.frontend_domain,
                sameSite: 'none',
                secure: true,
                path: '/',
            });

            throw new AppError('User is not authorized', 401);
        }

        return req.user;
    }

    async logout(
        req: Request,
        res: Response,
    ): Promise<boolean> {
        if (!req.user || !req.user.token) {
            return false;
        }
        const deletedSession = await this.sessionRepository.destroyByToken(req.user.token);
        if (deletedSession > 0) {
            res.clearCookie('token', {
                domain: this.environment.frontend_domain,
                sameSite: 'none',
                secure: true,
                path: '/',
            });

            return true;
        }

        return false;
    }
}
