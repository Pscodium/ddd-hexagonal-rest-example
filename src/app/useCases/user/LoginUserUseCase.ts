import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { LoginUserDTO } from '@/app/dto/user/LoginUserDTO';

export class LoginUserUseCase {
    private userRepository: Dependencies['userRepository'];
    private passwordValidator: Dependencies['passwordValidator'];
    constructor({ userRepository, passwordValidator }: Pick<Dependencies, 'userRepository' | 'passwordValidator'>) {
        this.userRepository = userRepository;
        this.passwordValidator = passwordValidator;
    }

    async execute(data: LoginUserDTO): Promise<User | null> {
        const userExists = await this.userRepository.findByEmail(data.email);

        if (!userExists) {
            throw new AppError('User not exists.', 404);
        }

        const passwordValidate = this.passwordValidator.passwordComparator(data.password, userExists.password);

        if (!passwordValidate) {
            throw new AppError('Invalid password.', 404);
        }

        const user = await this.userRepository.findById(userExists.id);

        return user;
    }
}