import { ENUMS } from "@/shared/enums";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";
import { PermissionsValuesType } from "@/types/Enums";

export class PermissionRequestService {
    private logger: Dependencies['logger'];
    private permissionRepository: Dependencies['permissionRepository'];

    private permissions: PermissionsValuesType[];

    constructor({ logger, permissionRepository }: Pick<Dependencies, 'logger' | 'permissionRepository'>) {
        this.logger = logger;
        this.permissionRepository = permissionRepository;

        this.permissions = Object.values(ENUMS.Permissions);
    }

    async hasPermission(userId: string, permissions: PermissionsValuesType[]): Promise<boolean> {
        if (!Array.isArray(permissions)) {
            permissions = [permissions];
        }

        const user_permissions = await this.permissionRepository.findOne(userId);
        if (!user_permissions) {
            throw new AppError('User does not have any Permissions', 404);
        }
        const hasPermission = permissions.filter(permission => user_permissions[permission] === true);

        return hasPermission.length === permissions.length;
    }


}