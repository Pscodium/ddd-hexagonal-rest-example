import { User } from '@/domain/entities/User';
import { CreateUserDTO } from '@/app/dto/user/CreateUserDTO';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class CreateUserUseCase {
    private userRepository: Dependencies['userRepository'];
    private passwordValidator: Dependencies['passwordValidator'];
    private logger: Dependencies['logger'];
    constructor({ userRepository, passwordValidator, logger }: Pick<Dependencies, 'userRepository' | 'passwordValidator' | 'logger'>) {
        this.userRepository = userRepository;
        this.passwordValidator = passwordValidator;
        this.logger = logger;
    }

    async execute(data: CreateUserDTO): Promise<User> {
        const userExists = await this.userRepository.findByEmail(data.email);

        if (userExists) {
            this.logger.warn('User already exists.');
            throw new AppError('User already exists.', 409);
        }

        const nicknameExists = await this.userRepository.nickExists(data.nickname);

        if (nicknameExists) {
            this.logger.warn('Nickname already exists.');
            throw new AppError('Nickname already exists.', 409);
        }

        const passwordValidate = this.passwordValidator.validadePassword(data.password);

        if (!passwordValidate) {
            this.logger.warn('Invalid password pattern.');
            throw new AppError('Invalid password pattern.', 400);
        }

        const hashedPassword = this.passwordValidator.encryptPassword(data.password);
        data.password = hashedPassword;

        const user = new User(data);
        return this.userRepository.save(user);
    }
}