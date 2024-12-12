// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';

// domain
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

// app
import { CreateUserUseCase } from '@/app/useCases/user/CreateUserUseCase';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOneUserUseCase';
import { PasswordValidator } from '@/app/services/user/PasswordValidator';

// interface
import { UserController } from '@/interface/http/controllers/UserController';

// Shared
import { RegexType } from '@/shared/utils/Regex';

// Types
import { EnvironmentVariables } from '@/types/Environment';
import { EnumsType } from '@/types/Enums';

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
    findOneUserUseCase: FindOneUserUseCase;
    /* Services */
    passwordValidator: PasswordValidator

    /* Interface */
    /* HTTP */
    /* Controller */
    userController: UserController;

    /* Config */
    /* Environment */
    environment: EnvironmentVariables;
    
    /* Shared */
    /* Enums */
    enums: EnumsType;
    /* Utils */
    regex: RegexType;

// eslint-disable-next-line semi
};
