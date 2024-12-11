import { EnumsType } from "@/shared/enums/types";

interface UserEntity {
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
}