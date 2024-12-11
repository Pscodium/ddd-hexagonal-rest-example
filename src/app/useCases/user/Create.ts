import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { CreateUserDTO } from '@/app/dto/user/CreateDTO';
import { AppError } from '@/shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UserRepository') private userRepository: IUserRepository,
    ) {}

    async execute(data: CreateUserDTO): Promise<User> {
        const userExists = await this.userRepository.findByEmail(data.email);

        if (userExists) {
            throw new AppError('User already exists.', 409);
        }

        const user = new User(data.name, data.email);
        return this.userRepository.save(user);
    }
}