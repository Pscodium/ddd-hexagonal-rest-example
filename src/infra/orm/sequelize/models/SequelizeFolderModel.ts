/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';
import { SequelizeUserModel } from './SequelizeUserModel';
import { SequelizeFileModel } from './SequelizeFileModel';

export class SequelizeFolderModel extends Model {
    public id!: string;
    public name!: string;
    public type!: string;
    public hex!: string;
    public private!: boolean;
    public UserId!: string;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            as: "User",
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
            hooks: {
                async beforeDestroy(folder, options) {
                    const files = await (folder as any).File;

                    for (const file of files) {
                        await SequelizeFileModel.destroy({
                            where: { id: file.id }
                        });
                    }
                },
                async beforeFind(options) {
                    if (!Array.isArray(options.include)) {
                        options.include = [];
                    }
            
                    options.include.push({
                        model: SequelizeFileModel,
                        as: "File",
                        order: [['createdAt', 'DESC']],
                        through: {
                            attributes: []
                        },
                    });
            
                    options.include.push({
                        model: SequelizeUserModel,
                        as: "User"
                    });

                    options.attributes = {
                        include: [
                            [
                                Sequelize.literal(`(
                                    SELECT COUNT(*) 
                                    FROM file_folders ff 
                                    WHERE ff.FileId = File.id
                                )`), "filesCount"
                            ]
                        ]
                    };
                },
            }
        }
    );
};