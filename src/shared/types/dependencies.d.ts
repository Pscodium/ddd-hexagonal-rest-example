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

export default interface Dependencies {
    /* Infra */
    /* Adapter*/
    SequelizeAdapter: SequelizeAdapter;
    /* Repository */
    SequelizeUserRepository: SequelizeUserRepository;

    /* Domain */
    /* Entity */
    User: User;
    /* Repository */
    IUserRepository: IUserRepository;

    /* App */
    /* Use Cases*/
    CreateUserUseCase: CreateUserUseCase;
    FindOneUserUseCase: FindOneUserUseCase

    /* Interface */
    /* HTTP */
    /* Controller */
    UserController: UserController;
    
// eslint-disable-next-line semi
};