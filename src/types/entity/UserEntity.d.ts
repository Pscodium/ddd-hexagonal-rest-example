import { EnumsType } from "../Enums";

export interface UserEntity {
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    profileIcon?: string;
    externalId?: string;
    role?: EnumsType['UserRoles'];
    status?: EnumsType['UserStatus'];
    verifiedEmail?: boolean;
    password: string;
    id?: string;
    token?: string | undefined;
}