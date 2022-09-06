export default async function isStrongPassword(password: any) {
    return typeof(password) === "string" && validatePassword(password) === "";
}
export function validatePassword(password: string) {
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }
}