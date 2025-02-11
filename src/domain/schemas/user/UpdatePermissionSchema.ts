import { ENUMS } from "@/shared/enums";
import { z } from "zod";

const PermissionsEnum: { [key: string]: z.ZodOptional<z.ZodBoolean> } = {};
Object.values(ENUMS.Permissions).forEach((key) => {
    PermissionsEnum[key] = z.boolean().optional();
});

const updatePermissionSchema = z.object(PermissionsEnum);

export { updatePermissionSchema };
