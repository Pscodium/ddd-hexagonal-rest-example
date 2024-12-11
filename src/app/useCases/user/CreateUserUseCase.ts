import { User } from '@/domain/entities/User';
import { CreateUserDTO } from '@/app/dto/user/CreateUserDTO';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/shared/types/Dependencies';

export class CreateUserUseCase {
    private userRepository: Dependencies['userRepository'];
    constructor({ userRepository }: Pick<Dependencies, 'userRepository'>) {
        this.userRepository = userRepository;
    }

    async execute(data: CreateUserDTO): Promise<User> {
        const userExists = await this.userRepository.findByEmail(data.email);

        if (userExists) {
            throw new AppError('User already exists.', 409);
        }

        const user = new User(data);
        return this.userRepository.save(user);
    }
}