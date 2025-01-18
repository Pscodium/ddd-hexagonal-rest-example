import { EnumsType } from "../Enums";
import { PermissionEntity } from "./PermissionEntity";

export interface IUserEntity {
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    profileIcon?: string;
    externalId?: string;
    role?: EnumsType['UserRoles'];
    status?: EnumsType['UserStatus'];
    verifiedEmail?: boolean;
    password?: string | undefined;
    id?: string;
    token?: string | undefined;
    Permission?: PermissionEntity;
}