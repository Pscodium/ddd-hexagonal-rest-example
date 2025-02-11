import { Permission } from '../entities/Permission';

export interface IPermissionRepository {
    findOne(userId: string): Promise<Permission | null>;
    updateUserPermission(permission: Partial<Permission>): Promise<[affectedCount: number]>
};