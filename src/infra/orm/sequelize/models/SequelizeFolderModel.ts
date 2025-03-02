/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

export class SequelizeFolderModel extends Model {
    public id!: string;
    public name!: string;
    public type!: string;
    public hex!: string;
    public private!: boolean;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            foreignKey: 'UserId',
            onDelete: 'CASCADE'
        });
        this.belongsToMany(models.File, {
            as: "File",
            through: "file_folders",
            foreignKey: "FolderId",
            timestamps: true,
            onDelete: 'CASCADE'
        });
    }
}

export const initSequelizeFolderModel = (sequelize: Sequelize) => {
    SequelizeFolderModel.init(
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
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            hex: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            private: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize: sequelize,
            tableName: 'folder',
        }
    );
};