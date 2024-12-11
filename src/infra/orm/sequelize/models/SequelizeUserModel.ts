import { DataTypes, Model, UUIDV4 } from 'sequelize';
import { container } from 'tsyringe';
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';

const sequelizeAdapter = container.resolve(SequelizeAdapter);

export class SequelizeUserModel extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
}

SequelizeUserModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeAdapter.getConnection(),
        tableName: 'users',
    }
);