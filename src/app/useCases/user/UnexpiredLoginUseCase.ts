import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { LoginUserDTO } from '@/app/dto/user/LoginUserDTO';
import { Response } from 'express';
import moment from 'moment';
import { serialize } from 'cookie';

export class UnexpiredLoginUseCase {
    private userRepository: Dependencies['userRepository'];
    private passwordValidator: Dependencies['passwordValidator'];
    private sessionRepository: Dependencies['sessionRepository'];
    private environment: Dependencies['environment'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, passwordValidator, sessionRepository, environment, logger }: Pick<Dependencies, 'userRepository' | 'passwordValidator' | 'sessionRepository' | 'environment' | 'logger'>) {
        this.userRepository = userRepository;
        this.passwordValidator = passwordValidator;
        this.sessionRepository = sessionRepository;
        this.environment = environment;
        this.logger = logger;
    }

    async execute(data: Partial<LoginUserDTO>, res: Response): Promise<User | null> {
        if (!data.login || !data.password) {
            throw new AppError('You need to send a correct body for this request', 422);
        }

        const userExists = await this.userRepository.findByEmailOrNickname(data.login);
        
        if (!userExists || !userExists.password) {
            throw new AppError('User not exists.', 404);
        }
        
        const passwordValidate = this.passwordValidator.passwordComparator(data.password, userExists.password);
        
        if (!passwordValidate) {
            throw new AppError('Invalid password.', 404);
        }
        
        const user = await this.userRepository.findById(userExists.id);
        
        if (!user) {
            this.logger.error('Login error, user undefined');
            throw new AppError('Something wrong with login.', 404);
        }
        
        const sessionExists = await this.sessionRepository.findOneByUserId(user?.id, this.environment.electron_origin);

        if (sessionExists) {
            await this.sessionRepository.destroy(sessionExists.sessionId);
        }

        const newSession = await this.sessionRepository.create({
            expirationDate: moment().add(999, 'years').valueOf(),
            jwt: null,
            userId: user?.id,
            origin: this.environment.electron_origin
        });
    
        const serialized = serialize('token', String(newSession.sessionId), {
            expires: new Date(newSession.expirationDate),
            domain: this.environment.frontend_domain,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        res.set('Set-Cookie', serialized);

        user.token = newSession.sessionId;
        return user;
    }
}