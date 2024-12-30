import { Permission } from '../entities/Permission';

export interface IPermissionRepository {
    findOne(userId: string): Promise<Permission | null>;
};