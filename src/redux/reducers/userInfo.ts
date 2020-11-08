import Cookies from "js-cookie";
import IAction from "../../types/action";

export default function userInfo(state = {
    _id: Cookies.get("user_id"),
}, action: IAction) {
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
            return {
                email: "",
                firstName: "",
                lastName: "",
                icon: "",
                _id: "",
                role: "",
                school_id: "",
            };
        default:
            return state;
    }
}