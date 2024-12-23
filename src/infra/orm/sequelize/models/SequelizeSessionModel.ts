/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

export class SequelizeSessionModel extends Model {
    public sessionId!: string;
    public jwt!: string | null;
    public userId!: string | undefined;
    public expirationDate!: number;
    public origin!: string | undefined;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            foreignKey: 'userId'
        });
    }
}

export const initSequelizeSessionModel = (sequelize: Sequelize) => {
    SequelizeSessionModel.init(
        {
            sessionId: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true,
            },
            jwt: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            expirationDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'expiration_date'
            },
            origin: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize: sequelize,
            tableName: 'session',
        }
    );
};