import IAction from "../../types/action";
import IUser, { Role } from "../../types/IUser";
import Cookies from "js-cookie";

const INITIAL_STATE = {
    email: "",
    firstName: "",
    lastName: "",
    icon: null,
    _id: process.browser ? Cookies.get("user_id") : "",
    role: (process.browser ? Cookies.get("role") : "student") as Role,
    school_id: process.browser ? Cookies.get("school_id") : "",
};

export default function userInfo(state: IUser & { school_id: string } = INITIAL_STATE, action: IAction): IUser & { school_id: string } {
    switch (action.type) {
        case "/user/info/update":
            return {
                ...state,
                ...action.payload
            };
        case "UPLOAD_DATA":
            return {
                email: action.payload.email,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                icon: action.payload.icon,
                _id: action.payload._id,
                role: action.payload.role,
                school_id: action.payload.school_id,
            };
        case "LOGOUT":
            return INITIAL_STATE;
        default:
            return state;
    }
}