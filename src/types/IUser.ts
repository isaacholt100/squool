export default interface IUser {
    _id: string;
    email: string;
    icon: string;
    role: string;
    firstName: string;
    lastName: string;
}

export type Role = "student" | "teacher" | "admin";