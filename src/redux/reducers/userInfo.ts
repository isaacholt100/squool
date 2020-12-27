import IAction from "../../types/action";
import IUser from "../../types/IUser";

const INITIAL_STATE = {
    email: "",
    firstName: "",
    lastName: "",
    icon: "",
    _id: "",
    role: null,
    school_id: "",
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