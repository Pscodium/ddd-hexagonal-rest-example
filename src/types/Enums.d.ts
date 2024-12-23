import { ENUMS } from "@/shared/enums";

export type EnumsType = typeof ENUMS;
export type PermissionsValuesType = (typeof ENUMS.Permissions)[keyof typeof ENUMS.Permissions];