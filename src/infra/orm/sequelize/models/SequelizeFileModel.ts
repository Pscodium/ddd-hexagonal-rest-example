/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

export class SequelizeFileModel extends Model {
    public id!: string;
    public name!: string;
    public url!: string;
    public type!: string;
    public private!: boolean;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            foreignKey: 'UserId',
            onDelete: 'CASCADE'
        });

        this.belongsToMany(models.Folder, {
            as: "Folder",
            through: "file_folders",
            foreignKey: "FileId",
            timestamps: true,
            onDelete: 'CASCADE'
        });
    }
}

export const initSequelizeFileModel = (sequelize: Sequelize) => {
    SequelizeFileModel.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            private: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize: sequelize,
            tableName: 'file',
        }
    );
};