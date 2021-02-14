export default interface IUser {
    _id: string;
    email: string;
    icon: string;
    role: Role;
    firstName: string;
    lastName: string;
}

export type Role = "student" | "teacher" | "admin" | "owner";