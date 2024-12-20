import { Session } from "@/domain/entities/Session";
import { User } from "@/domain/entities/User";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";

export class AuthorizationRequestService {
    private userRepository: Dependencies['userRepository'];
    private sessionRepository: Dependencies['sessionRepository'];
    private logger: Dependencies['logger'];

    constructor({ userRepository, sessionRepository, logger }: Pick<Dependencies, 'userRepository' | 'sessionRepository' | 'logger'>) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.logger = logger;
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
            throw new AppError('Invalid user id.', 403);
        }

        return new User(user);
    }

}