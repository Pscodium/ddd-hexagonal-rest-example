/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ENUMS } from '@/shared/enums';
import { PermissionEntity } from '@/types/entity/PermissionEntity';
import { DataTypes, Model, ModelAttributes, Optional, Sequelize, UUIDV4 } from 'sequelize';

export class SequelizePermissionModel extends Model<PermissionEntity> {
    public id!: string;
    public userId!: string;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User'
        });
    }
}

export const initSequelizePermissionModel = (sequelize: Sequelize) => {
    const permission_model: { [key: string]: any } = {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
    };
    Object.values(ENUMS.Permissions).forEach((key: string) => {
        permission_model[key] = {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        };
    });

    SequelizePermissionModel.init(permission_model as ModelAttributes<SequelizePermissionModel, Optional<PermissionEntity, never>>, {
        sequelize: sequelize,
        tableName: 'permission',
    });
};