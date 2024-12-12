import { DataTypes, Model, UUIDV4 } from 'sequelize';
import { container } from 'tsyringe';
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { enums } from '@/shared/enums';
import { EnumsType } from '@/types/Enums';

const sequelizeAdapter = container.resolve(SequelizeAdapter);

export class SequelizeUserModel extends Model {
    public id!: string;
    public profileIcon!: string; 
    public nickname!: string; 
    public external_id!: string; 
    public role!: EnumsType['UserRoles']; 
    public status!: EnumsType['UserStatus'];
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public verifiedEmail!: boolean;
    public password!: string;
}

SequelizeUserModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        profileIcon: {
            type: DataTypes.STRING,
            defaultValue: 'https://power.staging.onyo.com/assets/img/placeholder-user.png',
            allowNull: true
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9_]+$/
            }
        },
        externalId: {
            type: DataTypes.STRING,
            field: 'external_id',
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM(enums.values(enums.UserRoles)),
            defaultValue: enums.UserRoles.DEFAULT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(enums.values(enums.UserStatus)),
            defaultValue: enums.UserStatus.ACTIVE,
            allowNull: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verifiedEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: sequelizeAdapter.getConnection(),
        tableName: 'users',
    }
);