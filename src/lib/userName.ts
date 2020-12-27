import IUser from "../types/IUser";

export function getFullName(user: IUser) {
    return user.firstName + " " + user.lastName;
}
export function getShortName(user: IUser) {
    return user.role === "student" ? user.firstName : user.firstName + " " + user.lastName;
}