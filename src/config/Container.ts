import 'reflect-metadata';
import { container } from 'tsyringe';
// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';

// domain
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

// app
import { CreateUserUseCase } from '@/app/useCases/user/Create';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOne';

// interface
import { UserController } from '@/interface/http/controllers/UserController';



// INFRA ------
//   Adapter
container.registerSingleton<SequelizeAdapter>(
    'SequelizeAdapter',
    SequelizeAdapter
);
//   Repository
container.registerSingleton<IUserRepository>(
    'UserRepository',
    SequelizeUserRepository
);

// APP ------
//   Use Case
container.registerSingleton<CreateUserUseCase>(
    'CreateUserUseCase',
    CreateUserUseCase
);
container.registerSingleton<FindOneUserUseCase>(
    'FindOneUserUseCase',
    FindOneUserUseCase
);

// DOMAIN ------
//   Entity
container.registerSingleton<User>(
    'UserEntity',
    User
);

// INTERFACE ------
//   Controller
container.registerSingleton<UserController>(
    'UserController',
    UserController
);


