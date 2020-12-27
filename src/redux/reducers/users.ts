import IAction from "../../types/action";
import IUser from "../../types/IUser";

export default function users(state: IUser[] = [], action: IAction): IUser[] {
    switch (action.type) {
        case "UPLOAD_USERS":
            return action.payload;
        case "UPDATE_USER":
            return state.map(u => u._id === action.payload.user_id ? {
                ...u,
                ...action.payload.info,
            } : u);
        case "ADD_USER":
            return [...state, action.payload];
        case "REMOVE_USER":
            return state.filter(u => u._id !== action.payload);
        case "UPLOAD_DATA":
            return action.payload.users;
        default:
            return state;
    }
}