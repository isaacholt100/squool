import { Role } from "../types/IUser";

export function getRoleNumber(role: Role) {
    switch (role) {
        case "owner": {
            return 0;
        }
        case "admin": {
            return 1;
        }
        case "teacher": {
            return 2;
        }
        default: {
            return 3;
        }
    }
}
export function roleHasPermission(role: Role, permissionNumber: number) {
    return getRoleNumber(role) <= permissionNumber;
}