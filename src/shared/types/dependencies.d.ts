// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';

// domain
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

// app
import { CreateUserUseCase } from '@/app/useCases/user/CreateUserUseCase';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOneUserUseCase';

// interface
import { UserController } from '@/interface/http/controllers/UserController';

// Shared
import { EnvironmentVariables } from './Environment';

export default interface Dependencies {
    /* Infra */
    /* Adapter*/
    sequelizeAdapter: SequelizeAdapter;
    /* Repository */
    sequelizeUserRepository: SequelizeUserRepository;

    /* Domain */
    /* Entity */
    user: User;
    /* Repository */
    userRepository: IUserRepository;

    /* App */
    /* Use Cases*/
    createUserUseCase: CreateUserUseCase;
    findOneUserUseCase: FindOneUserUseCase

    /* Interface */
    /* HTTP */
    /* Controller */
    userController: UserController;

    /* Config */
    /* Environment */
    environment: EnvironmentVariables
    
// eslint-disable-next-line semi
};