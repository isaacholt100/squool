export default interface ISchool {
    _id: string;
    admin_id: string;
    name: string;
    roles: Record<string, string>;
    permissions: IPermissions;
}
export interface IPermissions {
    changeName: number;
    changeRoles: number;
    createClasses: number;
    removeUsers: number;
}