import IAction from "../../types/action";
import IBook from "../../types/IBook";
export default function books(state: IBook[] = [], action: IAction): IBook[] {
    switch (action.type) {
        case "UPLOAD_DATA":
            return action.payload.books;
        case "UPLOAD_BOOKS":
            return action.payload;
        case "/book/create":
            return [action.payload, ...state];
        case "/book/delete":
            return state.filter(b => b._id !== action.payload);
        case "/book/update":
            return state.map(b => b._id === action.payload._id ? {
                ...b,
                ...action.payload,
            } : b);
        default:
            return state;
    }
}